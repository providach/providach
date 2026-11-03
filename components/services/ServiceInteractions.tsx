'use client';

import {useRef,useState} from 'react';
import Image from 'next/image';
import {motion,useMotionValueEvent,useReducedMotion,useScroll} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import {Reveal} from '../Experience';

export type ServiceIndexItem={id:string;number:string;name:string};
export function ServiceNavigation({items}:{items:ServiceIndexItem[]}){
 const[active,setActive]=useState(0);
 const mobile=useRef<HTMLDetailsElement>(null);
 const{scrollY}=useScroll();
 useMotionValueEvent(scrollY,'change',()=>{let current=0;items.forEach((item,index)=>{const element=document.getElementById(item.id);if(element&&element.getBoundingClientRect().top<=window.innerHeight*.35)current=index});setActive(current)});
 const links=items.map((item,index)=><a key={item.id} href={`#${item.id}`} aria-current={active===index?'location':undefined} onClick={()=>{if(mobile.current)mobile.current.open=false}}><span aria-hidden="true">{item.number}</span><span>{item.name}</span><ArrowUpRight size={13}/></a>);
 return <aside className="services-index-rail"><nav className="services-desktop-index" aria-label="Service index"><p className="eyebrow">Explore our capabilities</p>{links}<div className="services-index-foot"><span>Individual disciplines.<br/>One connected perspective.</span><span className="services-index-current">{items[active].number} <span>/ 09</span></span></div></nav><details ref={mobile} className="services-mobile-index"><summary><span>Explore the nine services</span><span>{items[active].number} / 09</span></summary><nav aria-label="Mobile service index">{links}</nav></details></aside>
}

const environments=[
 {title:'Hospitality',copy:'Supporting the systems behind exceptional guest experiences.',image:'hospitality',ids:['hospitality-audio-visual','network-communication','it-consultancy','it-outsourcing','maintenance-support'],links:['Hospitality infotainment','Network infrastructure','IT consultancy','IT outsourcing','Maintenance & support']},
 {title:'Commercial & enterprise',copy:'Helping organisations build dependable technology environments.',image:'about-workplace',ids:['enterprise-solutions','it-consultancy','application-software-development','network-communication','maintenance-support'],links:['Enterprise solutions','IT consultancy','Software development','Network & communication','Technical support']},
 {title:'Buildings & facilities',copy:'Connecting infrastructure, safety, and smarter environments.',image:'about-architecture',ids:['automation-iot-green-building','fire-life-safety','network-communication','maintenance-support'],links:['Building automation & IoT','Fire, life & safety','Network infrastructure','Maintenance support']},
];
export function ServiceApplications(){
 const[active,setActive]=useState(0);
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 function keyboard(event:React.KeyboardEvent,index:number){let next=index;if(event.key==='ArrowRight')next=(index+1)%3;else if(event.key==='ArrowLeft')next=(index+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;event.preventDefault();setActive(next);tabs.current[next]?.focus()}
 const current=environments[active];
 return <section id="service-applications" className="services-applications services-section"><div className="wrap"><Reveal><div className="services-chapter-marker"><span className="eyebrow">03 / Technology in context</span><span/><span>Potential applications, shaped by the environment</span></div><div className="services-section-heading"><h2>Different environments.<br/><span>The same considered thinking.</span></h2><p>The right combination of expertise depends on the people, spaces, and operations a business needs to support.</p></div></Reveal><div className="services-environment-tabs" role="tablist" aria-label="Explore industry applications">{environments.map((item,index)=><button ref={node=>{tabs.current[index]=node}} key={item.title} role="tab" id={`environment-tab-${index}`} aria-selected={active===index} aria-controls="environment-panel" tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>keyboard(event,index)}><Image src={`/images/editorial/${item.image}.jpg`} alt="" fill sizes="(max-width: 700px) 100vw, 30vw"/><span className="services-environment-shade"/><span className="services-environment-number">0{index+1}</span><span className="services-environment-title">{item.title}</span><span className="services-environment-arrow"><ArrowUpRight size={23}/></span></button>)}</div><div className="services-environment-panel" id="environment-panel" role="tabpanel" aria-labelledby={`environment-tab-${active}`}><h3>{current.copy}</h3><div><p className="eyebrow">Relevant capabilities may include</p><div className="services-environment-links">{current.links.map((label,index)=><a key={label} href={`#${current.ids[index]}`}>{label}<ArrowUpRight size={12}/></a>)}</div></div></div></div></section>
}

const stages=[['Understand','Learn about the business, its current environment, and the challenges it wants to address.'],['Recommend','Identify appropriate technology options and a practical direction.'],['Implement','Deliver the agreed solution through relevant technical expertise.'],['Support','Provide appropriate maintenance, assistance, or ongoing technical services.']];
export function ServicesApproach(){
 const ref=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 const{scrollYProgress}=useScroll({target:ref,offset:['start 75%','end 45%']});
 return <section className="services-approach services-section"><div className="wrap"><Reveal><div className="services-chapter-marker"><span className="eyebrow">04 / Our approach</span><span/><span>A proposed engagement framework</span></div><div className="services-section-heading"><h2>Before technology<br/><span>comes understanding.</span></h2><p>Every business has its own environment, challenges, and priorities. A meaningful solution starts with those realities.</p></div></Reveal><div ref={ref} className="services-method-route"><div className="services-method-line" aria-hidden="true"><motion.span className="services-method-progress-horizontal" style={{scaleX:reduced?1:scrollYProgress}}/><motion.span className="services-method-progress-vertical" style={{scaleY:reduced?1:scrollYProgress}}/></div>{stages.map(([name,description],index)=><Reveal key={name} className="services-method-stage"><span className="services-method-dot"/><span className="services-method-number">0{index+1}</span><h3>{name}</h3><p>{description}</p></Reveal>)}</div></div></section>
}
