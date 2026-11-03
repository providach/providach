import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {enquirySchema,enquiryFieldErrors} from '@/lib/enquiry-schema';
import {deliverSubmission,DeliveryUnavailableError} from '@/lib/server/submission-delivery';
export const runtime='nodejs';
const limit=16000;
const attempts=new Map<string,{count:number;reset:number}>();
type DeliveryResult={id:string};
const submissions=new Map<string,{fingerprint:string;expires:number;result:Promise<DeliveryResult>}>();
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function readBody(req:NextRequest){
 if(Number(req.headers.get('content-length')||0)>limit)throw new RangeError();
 const reader=req.body?.getReader();if(!reader)throw new SyntaxError();
 const decoder=new TextDecoder();let size=0,text='';
 try{while(true){const{value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw new RangeError()}text+=decoder.decode(value,{stream:true})}text+=decoder.decode();return JSON.parse(text)}finally{reader.releaseLock()}
}
export async function POST(req:NextRequest){
 const origin=req.headers.get('origin');
 if(origin&&origin!==req.nextUrl.origin)return NextResponse.json({error:'This request could not be verified. Please refresh the page and try again.'},{status:403});
 const now=Date.now();
 for(const[key,value]of attempts)if(value.reset<now)attempts.delete(key);
 for(const[key,value]of submissions)if(value.expires<now)submissions.delete(key);
 const ipKey=createHash('sha256').update(req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local').digest('hex');
 let body:unknown;
 try{body=await readBody(req)}catch(error){return NextResponse.json({error:error instanceof RangeError?'Your enquiry is too long. Please shorten it and try again.':'Your request could not be read. Please try again.'},{status:error instanceof RangeError?413:400})}
 if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Please review your enquiry and try again.'},{status:400});
 const raw=body as Record<string,unknown>;
 const requestKey=req.headers.get('idempotency-key');
 if(requestKey&&!uuid.test(requestKey))return NextResponse.json({error:'Please refresh the page and try again.'},{status:400});
 if(raw.website||typeof raw.started!=='number'||now-raw.started<2000||raw.started>now)return NextResponse.json({error:'Please review your details and try again.'},{status:400});
 const parsed=enquirySchema.safeParse(raw);
 if(!parsed.success)return NextResponse.json({error:'Please review the highlighted fields.',fieldErrors:enquiryFieldErrors(parsed.error.issues)},{status:422});
 const fingerprint=createHash('sha256').update(JSON.stringify(parsed.data)).digest('hex');
 const existing=requestKey?submissions.get(requestKey):undefined;
 if(existing&&existing.fingerprint!==fingerprint)return NextResponse.json({error:'Your enquiry has changed. Please try sending it again.'},{status:409});
 if(!existing){const budget=attempts.get(ipKey)||{count:0,reset:now+900000};budget.count++;attempts.set(ipKey,budget);if(budget.count>5)return NextResponse.json({error:'You’ve sent several enquiries recently. Please try again in 15 minutes.'},{status:429,headers:{'Retry-After':'900'}})}
 try{
  if(existing){const result=await existing.result;return NextResponse.json({received:true,id:result.id},{status:200})}
  if(submissions.size>=500)return NextResponse.json({error:'Enquiries are temporarily busy. Please try again shortly.'},{status:503});
  const record={id:requestKey??crypto.randomUUID(),receivedAt:new Date().toISOString(),...parsed.data,type:'enquiry',status:'received'};
  const result=deliverSubmission({record,replyTo:parsed.data.email,subject:'Providach project enquiry',idempotencyKey:requestKey??record.id}).then(()=>({id:record.id}));
  if(requestKey)submissions.set(requestKey,{fingerprint,expires:now+1800000,result});
  await result;
  return NextResponse.json({received:true,id:record.id},{status:201});
 }catch(error){
  if(requestKey)submissions.delete(requestKey);
  if(error instanceof DeliveryUnavailableError)return NextResponse.json({error:'Online enquiries are temporarily unavailable. Your details are still here; please try sending again later.'},{status:503});
  console.error('[Providach] enquiry_processing_failed',{kind:error instanceof Error?error.name:'unknown'});
  return NextResponse.json({error:'Your enquiry could not be delivered. Your details are still here; please try again shortly.'},{status:502});
 }
}
