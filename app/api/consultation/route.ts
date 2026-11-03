import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {deliverSubmission,DeliveryUnavailableError} from '@/lib/server/submission-delivery';
import {services} from '@/components/data';
export const runtime='nodejs';
const attempts=new Map<string,{count:number,reset:number}>();
const required=['name','company','email','phone','service','description','date','time'] as const;
export async function POST(req:NextRequest){
 if(Number(req.headers.get('content-length')||0)>16000)return NextResponse.json({error:'Request is too large.'},{status:413});
 const origin=req.headers.get('origin');if(origin&&origin!==req.nextUrl.origin)return NextResponse.json({error:'Invalid request origin.'},{status:403});
 let data:Record<string,unknown>;try{const body=await req.text();if(body.length>16000)throw new Error();data=JSON.parse(body)}catch{return NextResponse.json({error:'Invalid request.'},{status:400})}
 if(!data||typeof data!=='object')return NextResponse.json({error:'Invalid request.'},{status:400});
 if(data.website||typeof data.started!=='number'||Date.now()-data.started<2000)return NextResponse.json({error:'Please review your details and try again.'},{status:400});
 const key=createHash('sha256').update(req.headers.get('x-forwarded-for')?.split(',')[0]||'local').digest('hex');const now=Date.now();for(const[k,v]of attempts)if(v.reset<now)attempts.delete(k);const attempt=attempts.get(key)||{count:0,reset:now+900000};attempt.count++;attempts.set(key,attempt);if(attempt.count>5)return NextResponse.json({error:'Too many requests. Please try again in 15 minutes.'},{status:429});
 for(const field of required)if(typeof data[field]!=='string'||!String(data[field]).trim()||String(data[field]).length>(field==='description'?5000:180))return NextResponse.json({error:`Please provide a valid ${field}.`},{status:400});
 const fields=Object.fromEntries(required.map(k=>[k,String(data[k]).trim()]));
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||!/^[+\d\s().-]{7,30}$/.test(fields.phone)||fields.description.length<15||!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)||Number.isNaN(Date.parse(fields.date))||fields.date<today||!/^([01]\d|2[0-3]):[0-5]\d$/.test(fields.time)||![...services.map(s=>s.title),'Help me understand what I need'].includes(fields.service))return NextResponse.json({error:'Please check your email, phone, service, project description, and preferred date and time.'},{status:400});
 const record={id:crypto.randomUUID(),receivedAt:new Date().toISOString(),...fields,timeZone:'Africa/Lagos',status:'requested'};
 try{
  await deliverSubmission({record,replyTo:fields.email,subject:'Providach consultation request'});
  return NextResponse.json({received:true,id:record.id},{status:201});
 }catch(error){if(error instanceof DeliveryUnavailableError)return NextResponse.json({error:'Online enquiries are temporarily unavailable. Please try again later.'},{status:503});console.error('[Providach] consultation_processing_failed',{submissionId:record.id,kind:error instanceof Error?error.name:'unknown'});return NextResponse.json({error:'Your request could not be delivered. Please try again shortly.'},{status:502})}
}
