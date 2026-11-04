import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {services} from '@/components/data';
import {consultationTimeError} from '@/lib/consultation-time';
const required=['name','company','email','phone','service','description','date','time'] as const;
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
 try{body=await readBody(req)}catch(error){return NextResponse.json({error:error instanceof RangeError?'Your consultation is too long. Please shorten it and try again.':'Your request could not be read. Please try again.'},{status:error instanceof RangeError?413:400})}
 if(!body||typeof body!=='object'||Array.isArray(body))return NextResponse.json({error:'Please review your consultation and try again.'},{status:400});
 const raw=body as Record<string,unknown>;
 const requestKey=req.headers.get('idempotency-key');
 if(requestKey&&!uuid.test(requestKey))return NextResponse.json({error:'Please refresh the page and try again.'},{status:400});
 if(raw.website||typeof raw.started!=='number'||now-raw.started<2000||raw.started>now)return NextResponse.json({error:'Please review your details and try again.'},{status:400});
 for(const field of required)if(typeof raw[field]!=='string'||!String(raw[field]).trim()||String(raw[field]).length>(field==='description'?5000:180))return NextResponse.json({error:`Please provide a valid ${field}.`},{status:400});
 const fields=Object.fromEntries(required.map(k=>[k,String(raw[k]).trim()]));
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||!/^[+\d\s().-]{7,30}$/.test(fields.phone)||fields.description.length<15||!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)||Number.isNaN(Date.parse(fields.date))||!/^([01]\d|2[0-3]):[0-5]\d$/.test(fields.time)||![...services.map(s=>s.title),'Help me understand what I need'].includes(fields.service))return NextResponse.json({error:'Please check your email, phone, service, project description, and preferred date and time.'},{status:400});
 const scheduleError=consultationTimeError(fields.date,fields.time,now);
 if(scheduleError)return NextResponse.json({error:scheduleError},{status:422});
 const fingerprint=createHash('sha256').update(JSON.stringify(fields)).digest('hex');
 const existing=requestKey?submissions.get(requestKey):undefined;
 if(existing&&existing.fingerprint!==fingerprint)return NextResponse.json({error:'Your consultation has changed. Please try sending it again.'},{status:409});
 if(!existing){const budget=attempts.get(ipKey)||{count:0,reset:now+900000};budget.count++;attempts.set(ipKey,budget);if(budget.count>5)return NextResponse.json({error:'You’ve sent several consultation requests recently. Please try again in 15 minutes.'},{status:429,headers:{'Retry-After':'900'}})}
 try{
  if(existing){const result=await existing.result;return NextResponse.json({received:true,id:result.id},{status:200})}
  if(submissions.size>=500)return NextResponse.json({error:'Consultations are temporarily busy. Please try again shortly.'},{status:503});
  const record={id:requestKey??crypto.randomUUID(),receivedAt:new Date().toISOString(),...fields,type:'consultation',timeZone:'Africa/Lagos',status:'requested'};
  const result=deliverSubmission({record,replyTo:fields.email,idempotencyKey:requestKey??record.id}).then(()=>({id:record.id}));
  if(requestKey)submissions.set(requestKey,{fingerprint,expires:now+1800000,result});
  await result;
  return NextResponse.json({received:true,id:record.id},{status:201});
 }catch(error){
  if(requestKey)submissions.delete(requestKey);
  if(error instanceof DeliveryUnavailableError)return NextResponse.json({error:'Online consultation requests are temporarily unavailable. Your details are still here; please try sending again later.'},{status:503});
  console.error('[Providach] consultation_processing_failed',{kind:error instanceof Error?error.name:'unknown'});
  return NextResponse.json({error:'Your consultation could not be delivered. Your details are still here; please try again shortly.'},{status:502});
 }
}
