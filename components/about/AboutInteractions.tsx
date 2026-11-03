'use client';

import {useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {AnimatePresence,motion,useMotionValueEvent,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import brandIcon from '@/public/images/icon.png';
import {Reveal} from '../Experience';

const principles=[
 {title:'Reliability is a responsibility.',body:'Businesses depend on their systems every day. Reliability is not simply a technical requirement. It is a commitment to the people and operations those systems support.',label:'The responsibility'},
 {title:'Understanding comes first.',body:'The right technology decision begins with the right questions. Before recommending solutions, we believe in understanding the environment, the challenges, and the outcome a business needs.',label:'The understanding'},
 {title:'Partnership goes beyond installation.',body:'Technology requires attention beyond the day it is delivered. We believe in relationships built on accountability, support, and a commitment to long-term value.',label:'The commitment'},
 {title:'Build for what comes next.',body:'The best systems address today’s requirements without losing sight of tomorrow. We believe technology should create room for businesses to adapt, evolve, and grow.',label:'The long view'},
];

export function AboutPrinciples(){
 const ref=useRef<HTMLDivElement>(null),items=useRef<(HTMLElement|null)[]>([]);
 const[active,setActive]=useState(0);
 const reduced=useReducedMotion();
 const{scrollY}=useScroll();
 const{scrollYProgress}=useScroll({target:ref,offset:['start 50%','end 50%']});
 useMotionValueEvent(scrollY,'change',()=>{let index=0;items.current.forEach((item,i)=>{if(item&&item.getBoundingClientRect().top<window.innerHeight*.45)index=i});setActive(index)});
 return <section id="about-beliefs" className="about-beliefs"><div className="wrap"><div className="about-chapter-marker"><span className="eyebrow">03 / The principles behind the work</span><span/><span>Proposed brand principles</span></div><div ref={ref} className="about-beliefs-layout"><aside className="about-beliefs-aside"><Image src={brandIcon} alt="" width={80} height={73} className="about-beliefs-icon"/><h2>What we believe<br/><span>shapes what<br/>we build.</span></h2><p>Four connected principles.<br/>One way of seeing technology.</p><nav className="about-belief-navigation" aria-label="Navigate brand principles">{principles.map((item,index)=><button key={item.label} aria-label={`Read principle ${index+1}: ${item.label}`} aria-current={active===index?'step':undefined} onClick={()=>items.current[index]?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'})}><span>0{index+1}</span><span/></button>)}</nav><span className="about-principle-aside-note">Built on trust.<br/>Driven by possibility.</span></aside><div className="about-principle-list"><div className="about-principle-rail" aria-hidden="true"><motion.div style={{scaleY:reduced?1:scrollYProgress}}/></div>{principles.map((item,index)=><article ref={node=>{items.current[index]=node}} className={`about-principle ${active===index?'current':''}`} id={`about-principle-${index}`} key={item.title}><div className="about-principle-meta"><span>0{index+1}</span><span>{item.label}</span></div><h3>{item.title}</h3><p>{item.body}</p>{index===1&&<div className="about-principle-photograph"><Image src="/images/editorial/about-workplace.jpg" alt="Illustrative workplace detail: architecture shaped around the people who use it" fill sizes="(max-width: 700px) 100vw, 45vw"/><span>Understanding the environment changes the thinking.</span></div>}</article>)}</div></div></div></section>
}

export function CinematicScene({src,alt,children}:{src:string;alt:string;children:React.ReactNode}){
 const ref=useRef<HTMLElement>(null);
 const reduced=useReducedMotion();
 const{scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
 const y=useTransform(scrollYProgress,[0,1],['-5%','5%']);
 return <section ref={ref} className="about-human"><motion.div className="about-human-photo" style={{y:reduced?0:y}}><Image src={src} alt={alt} fill sizes="100vw"/></motion.div><div className="about-human-scrim"/>{children}</section>
}

const framework=[
 {name:'Discover',caption:'Begin with the business.',description:'Understand the organisation, its operating environment, technical challenges, and business requirements.',question:'What needs to be possible?',image:'workplace'},
 {name:'Design',caption:'Give every decision a purpose.',description:'Translate those requirements into a practical technical approach aligned with the organisation’s needs.',question:'How should it work together?',image:'about-workplace'},
 {name:'Deliver',caption:'Make the thinking tangible.',description:'Implement, integrate, configure, or develop the agreed solution with attention to quality and operational fit.',question:'What will make it work in practice?',image:'infrastructure'},
 {name:'Support',caption:'Look beyond the handover.',description:'Provide appropriate technical support, maintenance, and guidance as the organisation’s requirements evolve.',question:'What needs to keep evolving?',image:'hero'},
];

export function AboutFramework(){
 const[active,setActive]=useState(0);
 const refs=useRef<(HTMLButtonElement|null)[]>([]);
 const reduced=useReducedMotion();
 const current=framework[active];
 function key(event:React.KeyboardEvent,index:number){let next=index;if(event.key==='ArrowRight')next=(index+1)%4;else if(event.key==='ArrowLeft')next=(index+3)%4;else if(event.key==='Home')next=0;else if(event.key==='End')next=3;else return;event.preventDefault();setActive(next);refs.current[next]?.focus()}
 return <section id="about-method" className="about-method about-section"><div className="wrap"><Reveal><div className="about-chapter-marker"><span className="eyebrow">05 / Thoughtful from the beginning</span><span/><span>A proposed engagement framework</span></div><div className="about-section-intro"><h2>Good solutions begin<br/>with <span>better questions.</span></h2><p>No two businesses operate in exactly the same way. Their environments, expectations, challenges, and ambitions are different. Effective technology begins with understanding.</p></div></Reveal><div className="about-method-tabs" role="tablist" aria-label="Explore the engagement framework"><div className="about-method-line" aria-hidden="true"><motion.span animate={{scaleX:(active+1)/4}} transition={{duration:reduced?0:.6,ease:[.22,1,.36,1]}}/></div>{framework.map((item,index)=><button key={item.name} ref={node=>{refs.current[index]=node}} role="tab" id={`about-method-tab-${index}`} aria-controls="about-method-panel" aria-selected={active===index} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>key(event,index)}><span className="about-method-point"/><span className="about-method-index">0{index+1}</span><span>{item.name}</span><ArrowRight size={16}/></button>)}</div><div className="about-method-panel" id="about-method-panel" role="tabpanel" aria-labelledby={`about-method-tab-${active}`}><div className="about-method-copy"><AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.3}}><p className="eyebrow">0{active+1} / {current.name}</p><h3>{current.caption}</h3><p>{current.description}</p><div className="about-method-question"><span className="eyebrow">The guiding question</span><p>{current.question}</p></div></motion.div></AnimatePresence></div><div className="about-method-image">{framework.map((item,index)=><Image key={item.name} src={`/images/editorial/${item.image}.jpg`} alt={`Illustrative environment for the ${item.name.toLowerCase()} stage`} fill sizes="(max-width: 700px) 100vw, 45vw" className={active===index?'visible':''}/>)}<span>Illustrative photography</span></div></div></div></section>
}

const experience=[
 {name:'Lilygate Hotel',scope:'IT Consultancy, Technology Overhauling & Outsourcing',date:'2020',image:'hospitality'},
 {name:'Isglo Hotels',scope:'IT Consultancy & Installations',date:null,image:'hero'},
 {name:'Reportage Hotels, Lagos',scope:'IT Consultancy',date:null,image:'about-architecture'},
 {name:'Free Hotspot Projects',scope:'Additional project experience',date:null,image:'infrastructure'},
 {name:'Software Development Projects',scope:'Additional project experience',date:null,image:'about-workplace'},
];

export function AboutExperience(){
 const[active,setActive]=useState(0);
 return <section className="about-experience about-section"><div className="wrap"><Reveal><div className="about-chapter-marker"><span className="eyebrow">06 / Experience in practice</span><span/><span>Our work meets the real world</span></div><div className="about-section-intro"><h2>Expertise finds its<br/><span>meaning in practice.</span></h2><p>Technology becomes meaningful when it moves beyond plans and into the environments where businesses operate.</p></div></Reveal><div className="about-experience-layout"><div className="about-experience-image">{experience.map((item,index)=><Image key={item.name} src={`/images/editorial/${item.image}.jpg`} alt={`Illustrative environment, not documentation of ${item.name}`} fill sizes="(max-width: 700px) 100vw, 52vw" className={active===index?'visible':''}/>)}<div className="about-experience-image-shade"/><div className="about-experience-caption"><span className="eyebrow">Selected experience / 0{active+1}</span><h3>{experience[active].name}</h3><p>{experience[active].scope}</p>{experience[active].date&&<span>{experience[active].date}</span>}</div></div><div className="about-experience-index"><p className="eyebrow">Explore the experience</p>{experience.map((item,index)=><button key={item.name} aria-pressed={active===index} aria-label={`Show experience: ${item.name}`} onClick={()=>setActive(index)}><span>0{index+1}</span><span>{item.name}</span><ArrowUpRight size={17}/></button>)}<Link className="text-link" href="/projects">Explore Our Projects <ArrowUpRight size={17}/></Link></div></div><p className="about-image-disclosure">Photography illustrates the environments we serve. It is not documentation of the projects shown.</p></div></section>
}
