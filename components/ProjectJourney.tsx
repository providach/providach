'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRef,useState,useSyncExternalStore} from 'react';
import {motion,useMotionValueEvent,useScroll,useTransform} from 'motion/react';
import {ArrowLeft,ArrowRight,ArrowUpRight,MoveRight} from 'lucide-react';

const selectedProjects=[
 {name:'Lilygate Hotel',scope:'IT Consultancy, Technology Overhauling & Outsourcing',year:'2020',image:'hospitality',label:'Consultancy. Infrastructure. Partnership.'},
 {name:'Isglo Hotels',scope:'IT Consultancy & Installations',year:null,image:'hero',label:'Considered technology. Seamless environments.'},
 {name:'Reportage Hotels, Lagos',scope:'IT Consultancy',year:null,image:'workplace',label:'Understanding first. Confidence follows.'},
];
const stops=[.09,.48,.9];
function subscribeToMotionPreference(callback:()=>void){const media=window.matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback)}
function readMotionPreference(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches}

export function ProjectJourney(){
 const range=useRef<HTMLDivElement>(null);
 const[active,setActive]=useState(0);
 const reduced=useSyncExternalStore(subscribeToMotionPreference,readMotionPreference,()=>false);
 const{scrollYProgress}=useScroll({target:range,offset:['start 78px','end end']});
 const x=useTransform(scrollYProgress,[0,.18,.39,.58,.8,1],['0%','0%','-33.333333%','-33.333333%','-66.666667%','-66.666667%']);
 useMotionValueEvent(scrollYProgress,'change',value=>setActive(value>=.69?2:value>=.285?1:0));
 function goTo(index:number){const node=range.current;if(!node)return;const travel=node.offsetHeight-(window.innerHeight-78);const start=node.getBoundingClientRect().top+window.scrollY-78;window.scrollTo({top:start+travel*stops[index],behavior:reduced?'auto':'smooth'})}
 return <section id="selected-projects" className="projects-horizontal" aria-labelledby="projects-title"><div ref={range} className="project-scroll-range"><div className="project-stage"><div className="project-stage-inner wrap">
  <div className="project-journey-heading"><div><p className="eyebrow">03 / Selected experience</p><h2 id="projects-title">Experience, <span>in perspective.</span></h2></div><Link href="/projects" className="text-link">View All Projects <ArrowUpRight size={16}/></Link></div>
  <div className="project-track-window"><motion.div className="project-horizontal-track" style={{x:reduced?0:x}}>{selectedProjects.map((project,index)=><article key={project.name} className="project-slide" aria-label={`${index+1} of 3: ${project.name}`} aria-hidden={reduced?undefined:active!==index} inert={reduced?undefined:active!==index}>
   <div className="project-slide-photo"><Image src={`/images/editorial/${project.image}.jpg`} alt={`Illustrative environment; not a photograph of ${project.name}`} fill sizes="(max-width: 700px) 100vw, 65vw"/><div className="project-slide-shade"/><span className="project-slide-photo-label">Hospitality / Selected engagement</span><span className="project-slide-signature">{project.label}</span><Link href="/projects" className="project-slide-explore" aria-label={`View project experience: ${project.name}`}><ArrowUpRight size={23}/></Link></div>
   <div className="project-slide-copy"><span className="project-slide-number">0{index+1}<span> / 03</span></span><div><p className="eyebrow">A selected engagement</p><h3>{project.name}</h3><div className="project-slide-scope"><p>{project.scope}</p>{project.year&&<span>{project.year}</span>}</div><Link className="text-link" href="/projects">Explore our experience <ArrowUpRight size={16}/></Link></div><p className="project-slide-note">Illustrative photography.<br/>Project scope as supplied by Providach.</p></div>
  </article>)}</motion.div></div>
  <div className="project-journey-controls"><div className="project-scroll-cue"><MoveRight size={18}/><span>Scroll to explore</span></div><div className="project-chapters" aria-label="Choose a project">{selectedProjects.map((project,index)=><button key={project.name} aria-label={`Show ${project.name}`} aria-current={active===index?'step':undefined} onClick={()=>goTo(index)}><span>0{index+1}</span><span className="project-chapter-line"/></button>)}</div><div className="project-arrow-controls"><button aria-label="Previous project" disabled={active===0} onClick={()=>goTo(active-1)}><ArrowLeft size={17}/></button><button aria-label="Next project" disabled={active===2} onClick={()=>goTo(active+1)}><ArrowRight size={17}/></button></div><a className="project-journey-skip" href="#our-approach">Continue to our approach ↓</a></div>
 </div></div></div></section>
}
