import Image from 'next/image';
import {BookButton} from '../Consultation';
import {Reveal} from '../Experience';
import type {ServiceDetail} from './serviceContent';

export function ServiceEditorial({service}:{service:ServiceDetail}){return <article id={service.id} className={`service-editorial service-editorial--${service.layout}`} aria-labelledby={`${service.id}-title`}>
 <header className="service-editorial-header"><span className="service-editorial-number">{service.number}</span><div><span className="eyebrow">A connected discipline</span><h2 id={`${service.id}-title`}>{service.name}</h2></div></header>
 {service.layout==='feature'&&service.image&&<div className="service-editorial-panorama"><Image src={`/images/editorial/${service.image}.jpg`} alt={`Illustrative environment for ${service.name.toLowerCase()}`} fill sizes="(max-width: 800px) 100vw, 72vw"/><span>Thoughtfully engineered. Connected by design.</span></div>}
 <div className="service-editorial-body"><div className="service-editorial-main"><Reveal><h3>{service.headline}</h3></Reveal><div className="service-editorial-description">{service.description.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div><details className="service-scope"><summary>Explore potential areas of engagement<span aria-hidden="true">+</span></summary><div><p className="eyebrow">Potential scope, subject to your requirements</p><ul>{service.scope.map(item=><li key={item}>{item}</li>)}</ul>{service.note&&<p className="service-scope-note">{service.note}</p>}</div></details><BookButton service={service.bookingService} className="service-consultation-link">{service.cta}</BookButton></div>
 <aside className="service-editorial-aside">{service.layout==='split'&&service.image&&<div className="service-editorial-detail-photo"><Image src={`/images/editorial/${service.image}.jpg`} alt={`Illustrative business environment for ${service.name.toLowerCase()}`} fill sizes="(max-width: 800px) 100vw, 26vw"/><span>Illustrative photography</span></div>}<div className="service-business-relevance"><span className="eyebrow">Why it matters</span><p>{service.relevance}</p></div></aside></div>
 </article>}
