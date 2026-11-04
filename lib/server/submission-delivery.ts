import 'server-only';
import {mkdir,open,readFile} from 'node:fs/promises';
import path from 'node:path';
import {submissionEmails} from './submission-emails';

export class DeliveryUnavailableError extends Error{}
type DeliveryInput={record:Record<string,string>;replyTo:string;idempotencyKey?:string};
export async function deliverSubmission({record,replyTo,idempotencyKey}:DeliveryInput):Promise<'email'|'stored'>{
 const apiKey=process.env.RESEND_API_KEY;
 const from=process.env.CONSULTATION_FROM;
 const to=process.env.CONSULTATION_TO;
 if(apiKey&&from&&to){
  const response=await fetch('https://api.resend.com/emails/batch',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':`submission-v2/${idempotencyKey??record.id}`},body:JSON.stringify(submissionEmails(record,from,to,replyTo)),signal:AbortSignal.timeout(15000)});
  if(!response.ok){console.error('[Providach] email_delivery_failed',{status:response.status,submissionId:record.id});throw new Error('Email delivery failed')}
  const result=await response.json();
  if(!Array.isArray(result.data)||result.data.length!==2||result.data.some((item:{id?:unknown})=>typeof item?.id!=='string'))throw new Error('Email acceptance could not be confirmed');
  return 'email';
 }
 const storage=process.env.CONSULTATION_STORAGE_DIR;
 if(!storage)throw new DeliveryUnavailableError('Submission delivery is not configured');
 const directory=path.resolve(storage);
 await mkdir(directory,{recursive:true,mode:0o700});
 const filename=path.join(directory,`${record.id}.json`);
 const file=await open(filename,'wx',0o600).catch(async(error:NodeJS.ErrnoException)=>{
  if(error.code!=='EEXIST'||!idempotencyKey)throw error;
  const previous=JSON.parse(await readFile(filename,'utf8')) as Record<string,string>;
  if(Object.entries(record).some(([key,value])=>key!=='receivedAt'&&previous[key]!==value))throw new Error('Submission reference already exists');
  return null;
 });
 if(!file)return 'stored';
 try{await file.writeFile(JSON.stringify(record))}finally{await file.close()}
 return 'stored';
}
