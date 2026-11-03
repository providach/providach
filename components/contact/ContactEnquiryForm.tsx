'use client';

import {useEffect,useId,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,ChevronDown,LoaderCircle} from 'lucide-react';
import {enquirySchema,enquiryFieldErrors,type EnquiryField} from '@/lib/enquiry-schema';
import {services} from '../data';

function makeRequestId():string|null{
 const crypto=globalThis.crypto;
 if(crypto?.randomUUID)return crypto.randomUUID();
 if(!crypto?.getRandomValues)return null;
 const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=Array.from(bytes,value=>value.toString(16).padStart(2,'0')).join('');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
const empty:Record<EnquiryField,string>={name:'',company:'',email:'',phone:'',service:'',description:'',contactMethod:'no-preference'};
const labels:Record<EnquiryField,string>={name:'Full name',company:'Company / organisation',email:'Work email',phone:'Phone number',service:'Service of interest',description:'Project or enquiry details',contactMethod:'Preferred contact method'};
export function ContactEnquiryForm(){
 const[values,setValues]=useState({...empty});
 const[errors,setErrors]=useState<Partial<Record<EnquiryField,string>>>({});
 const[status,setStatus]=useState<'idle'|'sending'|'error'|'success'>('idle');
 const[message,setMessage]=useState('');
 const[reference,setReference]=useState('');
 const started=useRef(Date.now()),sending=useRef(false),requestKey=useRef<string|null>(null);
 const trap=useRef<HTMLInputElement>(null),summary=useRef<HTMLDivElement>(null),success=useRef<HTMLDivElement>(null);
 const base=useId().replace(/:/g,'');
 const id=(field:EnquiryField)=>`${base}-${field}`;
 useEffect(()=>{if(status==='success'){success.current?.focus({preventScroll:true});success.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}},[status]);
 function change(field:EnquiryField,value:string){setValues(current=>({...current,[field]:value}));const next={...errors};delete next[field];setErrors(next);if(Object.keys(errors).length>0&&Object.keys(next).length===0){setStatus('idle');setMessage('')}requestKey.current=null}
 function fail(text:string,fieldErrors:Partial<Record<EnquiryField,string>>={}){setMessage(text);setErrors(fieldErrors);setStatus('error');requestAnimationFrame(()=>{summary.current?.focus({preventScroll:true});summary.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})})}
 const fieldError=(field:EnquiryField)=>errors[field]?<span id={`${id(field)}-error`} className="enquiry-field-error">{errors[field]}</span>:null;
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(sending.current)return;
  const result=enquirySchema.safeParse(values);
  if(!result.success){fail('Please review the highlighted fields.',enquiryFieldErrors(result.error.issues));return}
  sending.current=true;setStatus('sending');setErrors({});setMessage('');
  try{
   requestKey.current??=makeRequestId();
   const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json',...(requestKey.current?{'Idempotency-Key':requestKey.current}:{})},body:JSON.stringify({...result.data,started:started.current,website:trap.current?.value??''})});
   const body=await response.json();
   if(!response.ok||body.received!==true){fail(body.error||'Your enquiry could not be sent. Please try again.',body.fieldErrors??{});return}
   setReference(typeof body.id==='string'?body.id:'');setStatus('success');
  }catch{fail('Your connection may have been interrupted. Your details are still here; please try sending again.')}
  finally{sending.current=false}
 }
 if(status==='success')return <div ref={success} className="enquiry-success" role="status" tabIndex={-1} aria-labelledby={`${base}-success-title`}><span className="enquiry-success-symbol"><Check size={27} strokeWidth={1.4}/></span><p className="eyebrow">A conversation begins</p><h3 id={`${base}-success-title`}>Thank you<br/>for reaching out.</h3><p>Your enquiry has been received. Our team will review the details and follow up using the contact information you provided.</p>{reference&&<span className="enquiry-reference">Enquiry reference / {reference.slice(0,8)}</span>}<Link href="/" className="button">Return to Home <ArrowUpRight size={16}/></Link><button className="text-link" onClick={()=>{setValues({...empty});setErrors({});setMessage('');requestKey.current=null;started.current=Date.now();setStatus('idle')}}>Start another enquiry <ArrowUpRight size={15}/></button></div>;
 return <form className="contact-enquiry-form" method="post" action="/api/enquiry" onSubmit={submit} noValidate aria-label="Project enquiry" aria-busy={status==='sending'}>
  <div className="enquiry-form-heading"><span className="eyebrow">A little context, to begin.</span><span>Required fields are marked *</span></div>
  {status==='error'&&<div ref={summary} className="enquiry-error-summary" role="alert" tabIndex={-1}><p>{message}</p>{Object.keys(errors).length>0&&<ul>{(Object.keys(errors) as EnquiryField[]).map(field=><li key={field}><a href={`#${id(field)}`} onClick={event=>{event.preventDefault();document.getElementById(id(field))?.focus()}}>{labels[field]} — {errors[field]}</a></li>)}</ul>}</div>}
  <fieldset disabled={status==='sending'} className="enquiry-fields"><legend className="sr-only">Your details and requirements</legend>
   <div className="enquiry-form-section"><span>01</span><p>Your details</p></div>
   {(['name','company','email','phone'] as const).map(field=><div className="enquiry-field" key={field}><label htmlFor={id(field)}>{labels[field]} <span>{field==='company'?'(optional)':'*'}</span></label><input id={id(field)} name={field} type={field==='email'?'email':field==='phone'?'tel':'text'} autoComplete={field==='name'?'name':field==='company'?'organization':field==='email'?'email':'tel'} value={values[field]} onChange={event=>change(field,event.target.value)} required={field!=='company'} maxLength={field==='email'?254:field==='phone'?40:180} aria-invalid={!!errors[field]} aria-describedby={errors[field]?`${id(field)}-error`:undefined} placeholder={field==='name'?'Your full name':field==='company'?'Your organisation':field==='email'?'you@company.com':'+234 …'}/>{fieldError(field)}</div>)}
   <div className="enquiry-form-section"><span>02</span><p>What are you working toward?</p></div>
   <div className="enquiry-field enquiry-full"><label htmlFor={id('service')}>Service of interest <span>*</span></label><div className="enquiry-select"><select id={id('service')} name="service" required value={values.service} onChange={event=>change('service',event.target.value)} aria-invalid={!!errors.service} aria-describedby={errors.service?`${id('service')}-error`:undefined}><option value="" disabled>Select a service or General Enquiry</option>{services.map(item=><option value={item.title} key={item.icon}>{item.title}</option>)}<option>General Enquiry</option></select><ChevronDown size={15} aria-hidden="true"/></div>{fieldError('service')}</div>
   <div className="enquiry-field enquiry-full"><label htmlFor={id('description')}>Tell us about your project or requirements <span>*</span></label><textarea id={id('description')} name="description" required rows={6} minLength={15} maxLength={5000} value={values.description} onChange={event=>change('description',event.target.value)} aria-invalid={!!errors.description} aria-describedby={`${id('description')}-hint${errors.description?` ${id('description')}-error`:''}`} placeholder="What would you like to achieve, improve, or explore?"/><div id={`${id('description')}-hint`} className="enquiry-message-hint"><span>A little context helps us understand.</span><span>{values.description.length.toLocaleString()} / 5,000</span></div>{fieldError('description')}</div>
   <fieldset className="enquiry-contact-method enquiry-full"><legend>Preferred contact method <span>(optional)</span></legend>{[['no-preference','No preference'],['email','Email'],['phone','Telephone']].map(([value,label])=><label key={value}><input type="radio" name="contactMethod" value={value} checked={values.contactMethod===value} onChange={()=>change('contactMethod',value)}/><span>{label}</span></label>)}</fieldset>
   <div className="enquiry-full enquiry-submit-area"><p className="enquiry-privacy">We use the information you submit to respond to your enquiry and discuss the appropriate next steps.</p><button className="button enquiry-submit" type="submit" disabled={status==='sending'}>{status==='sending'?'Sending your enquiry…':'Send Enquiry'}{status==='sending'?<LoaderCircle className="enquiry-spinner" size={17}/>:<ArrowUpRight size={17}/>}</button><span className="sr-only" role="status">{status==='sending'?'Sending your enquiry. Please wait.':''}</span></div>
  </fieldset><label className="honeypot" aria-hidden="true">Leave this blank<input ref={trap} name="website" tabIndex={-1} autoComplete="off"/></label>
 </form>
}
