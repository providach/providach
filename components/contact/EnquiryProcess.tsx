'use client';

import {useRef} from 'react';
import {motion,useReducedMotion,useScroll} from 'motion/react';
import {Reveal} from '../Experience';
const journey=[['Share your requirements','Tell us about your organisation, the challenge you’re facing, or the project you’re considering.'],['Initial review','Your enquiry can be reviewed to understand the nature of the requirement and the appropriate next steps.'],['A conversation','Where appropriate, a discussion can help clarify your needs, expectations, and technical considerations.'],['The way forward','Based on the discussion, the next step may involve further assessment, a proposal, or a more detailed technical engagement.']];
export function EnquiryProcess(){
 const ref=useRef<HTMLDivElement>(null);
 const reduced=useReducedMotion();
 const{scrollYProgress}=useScroll({target:ref,offset:['start 65%','end 55%']});
 return <section className="contact-next contact-page-section"><div className="wrap"><div className="contact-chapter-marker"><span className="eyebrow">04 / A clear beginning</span><span/><span>A proposed enquiry workflow</span></div><div className="contact-next-layout"><Reveal className="contact-next-intro"><h2>What happens<br/>after you<br/><span>reach out?</span></h2><p>A thoughtful beginning creates a clearer way forward. This proposed journey outlines how an enquiry could lead to a more focused conversation.</p></Reveal><div ref={ref} className="contact-next-route"><div className="contact-next-line" aria-hidden="true"><motion.span style={{scaleY:reduced?1:scrollYProgress}}/></div>{journey.map(([title,description],index)=><Reveal key={title} className="contact-next-stage"><span className="contact-next-node"/><span className="contact-next-number">0{index+1}</span><div><h3>{title}</h3><p>{description}</p></div></Reveal>)}</div></div></div></section>
}
