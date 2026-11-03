'use client';

import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUp,ArrowUpRight} from 'lucide-react';
import logo from '@/public/images/logo.png';
import {BookButton} from './Consultation';

const navigation=[['/','Home'],['/about','About Providach'],['/services','Our expertise'],['/projects','Selected experience'],['/contact','Contact']];
const capabilities=['Technology & enterprise','Infrastructure & connectivity','Hospitality & intelligent buildings','Support & outsourcing'];

export function FooterSequence({children}:{children:React.ReactNode}){
 const prelude=useRef<HTMLDivElement>(null);
 const[top,setTop]=useState(0);
 const reduced=useReducedMotion();
 useEffect(()=>{const node=prelude.current;if(!node)return;const measure=()=>setTop(Math.min(0,window.innerHeight-node.getBoundingClientRect().height));const observer=new ResizeObserver(measure);observer.observe(node);window.addEventListener('resize',measure);measure();return()=>{observer.disconnect();window.removeEventListener('resize',measure)}},[]);
 return <div className="footer-sequence"><div ref={prelude} className="footer-prelude" style={{top:reduced?undefined:top}}>{children}</div><PremiumFooter overlapping/></div>
}

export function PremiumFooter({overlapping=false}:{overlapping?:boolean}){
 const ref=useRef<HTMLElement>(null);
 const reduced=useReducedMotion();
 const{scrollYProgress}=useScroll({target:ref,offset:['start end','start start']});
 const borderRadius=useTransform(scrollYProgress,[0,.9],['50% 50% 0% 0% / 300px 300px 0px 0px','0% 0% 0% 0% / 0px 0px 0px 0px']);
 return <motion.footer ref={ref} className={`site-footer premium-footer ${overlapping?'footer-overlapping':''}`} style={{borderRadius:reduced?0:borderRadius}} aria-labelledby="footer-title" role="contentinfo"><div className="wrap">
  <div className="footer-opening"><div className="footer-opening-label"><span className="eyebrow">The next chapter</span><span className="footer-label-rule"/><span>Built on trust. Driven by possibility.</span></div><div className="footer-invitation"><h2 id="footer-title">Let’s move<br/><span>forward.</span></h2><div className="footer-invitation-aside"><p>Good conversations lead<br/>to better foundations.</p><BookButton className="footer-consultation-orbit"><span className="sr-only">Book a Consultation</span></BookButton><span className="footer-orbit-caption">Start a conversation</span></div></div></div>
  <div className="footer-directory"><div className="footer-positioning"><p>Dependable technology.<br/>Confidence to move forward.</p><span>Thoughtfully engineered solutions for<br/>businesses and the environments they serve.</span><Link className="footer-contact-link" href="/contact">Connect with our team <ArrowUpRight size={15}/></Link></div><nav className="footer-explore" aria-label="Footer navigation"><p className="eyebrow">Explore</p>{navigation.map(([href,label],i)=><Link key={href} href={href}><span className="footer-link-index">0{i+1}</span>{label}<ArrowUpRight size={12}/></Link>)}</nav><nav className="footer-capabilities" aria-label="Footer capabilities"><p className="eyebrow">Connected expertise</p>{capabilities.map(label=><Link href="/services" key={label}>{label}<ArrowUpRight size={12}/></Link>)}<BookButton className="footer-book-link"/></nav></div>
  <div className="footer-brand-line"><span className="eyebrow">Technology & infrastructure solutions</span><a href="#top" className="footer-return"><span>Back to the beginning</span><span className="footer-return-circle"><ArrowUp size={17}/></span></a></div>
  <Link href="/" aria-label="Providach Limited home" className="footer-grand-wordmark"><Image src={logo} alt="Providach Limited" sizes="(max-width: 700px) 100vw, 92vw"/></Link>
  <div className="footer-imprint"><span>© {new Date().getFullYear()} Providach Limited.</span><span>Built for today. Ready for what comes next.</span><span>All rights reserved.</span></div>
 </div></motion.footer>
}
