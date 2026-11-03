'use client';

import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {AnimatePresence,motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {ArrowDown,ArrowUpRight,Minus,Plus} from 'lucide-react';
import {services} from './data';
import {Reveal} from './Experience';

const chapters=[
 {name:'Strategy & enterprise',note:'Clarity before complexity.',image:'workplace',services:[0,1,7],caption:'Consider the business. Shape the solution.'},
 {name:'Intelligent environments',note:'Spaces that work beautifully.',image:'hero',services:[2,3,4],caption:'Every environment. Thoughtfully connected.'},
 {name:'Connected operations',note:'Dependability, every day.',image:'infrastructure',services:[6,5,8],caption:'The confidence to keep moving forward.'},
];

export function ExpertiseSequence({children}:{children:React.ReactNode}){
 const hold=useRef<HTMLDivElement>(null),panel=useRef<HTMLDivElement>(null);
 const[top,setTop]=useState(0);
 const reduced=useReducedMotion();
 useEffect(()=>{const element=hold.current;if(!element)return;const measure=()=>setTop(Math.min(0,window.innerHeight-element.getBoundingClientRect().height));const observer=new ResizeObserver(measure);observer.observe(element);window.addEventListener('resize',measure);measure();return()=>{observer.disconnect();window.removeEventListener('resize',measure)}},[]);
 const{scrollYProgress}=useScroll({target:panel,offset:['start end','start start']});
 const borderRadius=useTransform(scrollYProgress,[0,.9],['50% 50% 0% 0% / 300px 300px 0px 0px','0% 0% 0% 0% / 0px 0px 0px 0px']);
 return <div className="expertise-sequence"><div ref={hold} className="expertise-hold" style={{top:reduced?undefined:top}}><ExpertiseShowcase/></div><motion.div ref={panel} className="oval-projects-panel" style={{borderRadius:reduced?0:borderRadius}}>{children}</motion.div></div>
}

function ExpertiseShowcase(){
 const[chapter,setChapter]=useState(0),[active,setActive]=useState(0);
 const reduced=useReducedMotion();
 const tabRefs=useRef<(HTMLButtonElement|null)[]>([]);
 const current=chapters[chapter],service=services[active];
 function chooseChapter(index:number){setChapter(index);setActive(chapters[index].services[0])}
 function navigateTabs(e:React.KeyboardEvent,index:number){let next=index;if(e.key==='ArrowRight')next=(index+1)%3;else if(e.key==='ArrowLeft')next=(index+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();chooseChapter(next);tabRefs.current[next]?.focus()}
 return <section id="expertise" className="expertise-gallery" aria-labelledby="expertise-heading"><div className="wrap"><Reveal><div className="expertise-overline"><p className="eyebrow">02 / A connected body of expertise</p><span/><p>Nine disciplines. One considered approach.</p></div><div className="expertise-intro"><h2 id="expertise-heading">Precision in every detail.<br/><span>Possibility in every connection.</span></h2><div><span className="expertise-intro-rule"/><p>From the first strategic decision to the systems you rely on every day. A breadth of expertise, working as one.</p></div></div></Reveal>
  <div className="expertise-chapters" role="tablist" aria-label="Explore expertise collections">{chapters.map((item,index)=><button key={item.name} ref={node=>{tabRefs.current[index]=node}} id={`expertise-chapter-${index}`} role="tab" aria-controls="expertise-collection" aria-selected={chapter===index} tabIndex={chapter===index?0:-1} onClick={()=>chooseChapter(index)} onKeyDown={e=>navigateTabs(e,index)}><span>0{index+1}</span>{item.name}<ArrowUpRight size={15}/>{chapter===index&&<motion.span className="expertise-chapter-line" layoutId="expertise-chapter-line" transition={{duration:reduced?0:.4}}/>}</button>)}</div>
  <div className="expertise-collection" id="expertise-collection" role="tabpanel" aria-labelledby={`expertise-chapter-${chapter}`}>
   <div className="expertise-curation"><div className="expertise-collection-note"><span className="eyebrow">The collection</span><AnimatePresence mode="wait" initial={false}><motion.p key={chapter} initial={reduced?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}>{current.note}</motion.p></AnimatePresence></div>
   <div className="expertise-discipline-list">{current.services.map(index=><div className={`expertise-discipline ${active===index?'selected':''}`} key={services[index].icon}><h3><button onClick={()=>setActive(index)} aria-expanded={active===index} aria-controls={`discipline-${index}`}><span className="discipline-number">{services[index].icon}</span><span>{services[index].title}</span>{active===index?<Minus size={17}/>:<Plus size={17}/>}</button></h3><div className="discipline-details" id={`discipline-${index}`} hidden={active!==index}><p>{services[index].desc}</p><button className="text-link on-dark" onClick={()=>window.dispatchEvent(new Event('consultation:open'))}>Discuss this capability <ArrowUpRight size={15}/></button></div></div>)}</div>
   <div className="expertise-index-footer"><span>Explore a discipline.<br/>Discover how it connects.</span><Link className="text-link on-dark" href="/services">View All Services <ArrowUpRight size={16}/></Link></div></div>
   <div className="expertise-portrait"><div className="expertise-orbit" aria-hidden="true"/><div className="expertise-photo-window">{chapters.map((item,index)=><Image key={item.name} src={`/images/editorial/${item.image}.jpg`} alt={index===0?'Illustrative architectural workplace':index===1?'Illustrative hospitality interior':'Illustrative network and server infrastructure'} fill sizes="(max-width: 700px) 100vw, 45vw" className={chapter===index?'visible':''}/>)}<div className="expertise-photo-shade"/><div className="expertise-photo-top"><span className="eyebrow">Providach / Expertise</span><span>0{chapter+1} — 03</span></div><div className="expertise-photo-caption"><AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.3}}><span className="expertise-photo-number">{service.icon}</span><p>{current.caption}</p><span className="expertise-photo-discipline">{service.title}</span></motion.div></AnimatePresence></div></div><div className="expertise-portrait-caption"><span>Illustrative environments</span><span className="gold">Thoughtfully engineered.</span></div></div>
  </div>
  <div className="expertise-signoff"><p>Individual disciplines.<br/><span>One dependable partner.</span></p><a href="#selected-projects"><span>From expertise to experience</span><ArrowDown size={18}/></a></div>
 </div></section>
}
