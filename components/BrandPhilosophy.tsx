'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRef,useState} from 'react';
import {AnimatePresence,motion,useMotionValue,useReducedMotion,useSpring} from 'motion/react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Layers,Minus} from 'lucide-react';
import {Reveal} from './Experience';

const perspectives=[
 {name:'The guest',label:'Hospitality, without hesitation',title:'A seamless arrival.',copy:'A guest connects without hesitation. Every quiet detail creates the space for an exceptional stay.',image:'hero',alt:'A welcoming lounge with warm materials and considered architectural details',foundation:'The connection behind the welcome.',detail:'Connectivity, communication, and hospitality systems. Thoughtfully integrated so the experience feels effortless.'},
 {name:'The team',label:'Space for uninterrupted thinking',title:'Room to do remarkable things.',copy:'A team works without interruption. Dependable systems let people give their attention to the work that matters.',image:'workplace',alt:'A light-filled workplace with glass meeting rooms and natural materials',foundation:'The infrastructure behind the focus.',detail:'Networks, enterprise solutions, and ongoing technical support. A connected foundation for the everyday work of a business.'},
 {name:'The ambition',label:'Foundations for what comes next',title:'Confidence to look ahead.',copy:'A business moves forward without wondering whether its systems can keep up. Today’s decisions make room for tomorrow.',image:'hospitality',alt:'An expansive hospitality environment at dusk',foundation:'The thinking behind the possibility.',detail:'Consultancy, intelligent building systems, and purpose-built software. Technology decisions shaped around the needs of the business.'},
];

export function BrandPhilosophy(){
 const[active,setActive]=useState(0);
 const[foundation,setFoundation]=useState(false);
 const reduced=useReducedMotion();
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 const x=useMotionValue(0),y=useMotionValue(0);
 const imageX=useSpring(x,{stiffness:65,damping:25}),imageY=useSpring(y,{stiffness:65,damping:25});
 const scene=perspectives[active];
 function select(index:number){setActive((index+perspectives.length)%perspectives.length);setFoundation(false);x.set(0);y.set(0)}
 function keyboard(event:React.KeyboardEvent,index:number){let next=index;if(event.key==='ArrowRight')next=(index+1)%3;else if(event.key==='ArrowLeft')next=(index+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;event.preventDefault();select(next);tabs.current[next]?.focus()}
 return <section id="philosophy" className="philosophy atelier-section" aria-labelledby="philosophy-title"><div className="wrap">
  <Reveal><div className="atelier-kicker"><span className="eyebrow">01 / The invisible foundation</span><span className="atelier-kicker-line"/><span className="atelier-edition">A perspective by Providach</span></div>
  <div className="atelier-introduction"><div><p className="eyebrow atelier-prelude">The finest experiences leave nothing to chance.</p><h2 id="philosophy-title">Effortless on <br/>the surface.<br/><span>Exceptional<br/>underneath.</span></h2></div><div className="atelier-manifesto"><span className="atelier-monogram" aria-hidden="true">P<span>/</span></span><p>Great technology is often the kind you never have to think about.</p><p>Behind the ordinary moments are extraordinary considerations. The decisions, infrastructure, and expertise that make everything feel effortless.</p><Link className="text-link" href="/about">The thinking behind Providach <ArrowUpRight size={16}/></Link></div></div></Reveal>
  <Reveal className="atelier-experience"><div className="atelier-viewer" role="tabpanel" id="perspective-panel" aria-labelledby={`perspective-tab-${active}`} onPointerMove={event=>{if(reduced||event.pointerType!=='mouse')return;const box=event.currentTarget.getBoundingClientRect();x.set((event.clientX-box.left-box.width/2)*.012);y.set((event.clientY-box.top-box.height/2)*.012)}} onPointerLeave={()=>{x.set(0);y.set(0)}}>
   <motion.div className="atelier-photos" style={{x:reduced?0:imageX,y:reduced?0:imageY}}>{perspectives.map((item,index)=><Image key={item.name} className={active===index&&!foundation?'visible':''} src={`/images/editorial/${item.image}.jpg`} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 92vw"/>)}<Image className={foundation?'visible':''} src="/images/editorial/infrastructure.jpg" alt="Illustrative server infrastructure: the systems behind the visible experience" fill sizes="(max-width: 700px) 100vw, 92vw"/></motion.div>
   <div className={`atelier-image-scrim ${foundation?'foundation-visible':''}`}/>
   <div className="atelier-viewer-top"><span className="eyebrow">{foundation?'Beneath the experience':scene.label}</span><span className="atelier-view-index">0{active+1}<span> / 03</span></span></div>
   <div className="atelier-corner atelier-corner-top" aria-hidden="true"/><div className="atelier-corner atelier-corner-bottom" aria-hidden="true"/>
   <div className="atelier-scene-copy"><AnimatePresence mode="wait" initial={false}><motion.div key={`${active}-${foundation}`} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={reduced?{opacity:1}:{opacity:0,y:-8}} transition={{duration:.3}}><p className="eyebrow">{foundation?'Considered. Connected. Dependable.':'Because every system serves someone.'}</p><h3>{foundation?scene.foundation:scene.title}</h3><p className="atelier-scene-description">{foundation?scene.detail:scene.copy}</p></motion.div></AnimatePresence></div>
   <button className="atelier-reveal-control" aria-pressed={foundation} onClick={()=>setFoundation(!foundation)}><span className="atelier-control-icon">{foundation?<Minus size={18}/>:<Layers size={18}/>}</span><span>{foundation?'Return to the experience':'Reveal the foundation'}</span><ArrowUpRight size={16}/></button>
  </div>
  <div className="atelier-selector"><div className="atelier-tablist" role="tablist" aria-label="Explore the people technology serves">{perspectives.map((item,index)=><button ref={node=>{tabs.current[index]=node}} key={item.name} id={`perspective-tab-${index}`} role="tab" aria-selected={active===index} aria-controls="perspective-panel" tabIndex={active===index?0:-1} onKeyDown={event=>keyboard(event,index)} onClick={()=>select(index)}><span className="atelier-tab-number">0{index+1}</span><span>{item.name}</span><span className="atelier-tab-dot"/>{active===index&&<motion.span className="atelier-tab-underline" layoutId="perspective-underline" transition={{duration:reduced?0:.4,ease:[.22,1,.36,1]}}/>}</button>)}</div><div className="atelier-directions"><button aria-label="Previous perspective" onClick={()=>select(active-1)}><ArrowLeft size={19}/></button><button aria-label="Next perspective" onClick={()=>select(active+1)}><ArrowRight size={19}/></button></div></div>
  <div className="atelier-colophon"><span>Illustrative environments. Real considerations.</span><p>Technology should create the confidence<br/>to focus on what matters.</p><span>Built on trust.<br/>Driven by possibility.</span></div></Reveal>
 </div></section>
}
