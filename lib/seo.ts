import type {Metadata} from 'next';

export const siteUrl='https://providachltd.com';
export const siteName='Providach Limited';
export const previewDeployment=process.env.VERCEL_ENV==='preview'||process.env.VERCEL_ENV==='development';
export const socialImage={url:'/images/banner.jpg',width:7016,height:4961,alt:'Providach Limited — technology solutions built on trust, driven by possibility.',type:'image/jpeg'};
export const seoPages={
 '/':{label:'Home',title:'IT Consultancy & Technology Solutions in Nigeria',description:'Providach Limited provides IT consultancy, network infrastructure, software development, hospitality technology and technical support for businesses in Nigeria.'},
 '/about':{label:'About',title:'About Providach | Technology Solutions Company in Nigeria',description:'Meet Providach Limited, a Nigerian technology solutions company connecting IT consultancy, enterprise infrastructure, software development and dependable support.'},
 '/services':{label:'Services',title:'IT Services & Software Development in Nigeria',description:'Explore IT consultancy, enterprise solutions, network infrastructure, software development, building automation, hospitality AV and IT support from Providach.'},
 '/projects':{label:'Projects',title:'IT & Hospitality Technology Projects',description:'Explore Providach’s project experience in hotel IT consultancy, network connectivity and software development, including hospitality projects in Lagos, Nigeria.'},
 '/contact':{label:'Contact',title:'Contact Providach | IT Consultation & Project Enquiries',description:'Contact Providach Limited to discuss IT consultancy, network infrastructure, software development or technical support in Nigeria. Request a consultation.'},
} as const;
export type SeoPath=keyof typeof seoPages;
export function absoluteUrl(path:string){return new URL(path,siteUrl).href}
export function pageMetadata(path:SeoPath):Metadata{
 const {title,description}=seoPages[path];
 const fullTitle=path==='/about'||path==='/contact'?title:`${title} | ${siteName}`;
 return {title:{absolute:fullTitle},description,alternates:{canonical:absoluteUrl(path)},openGraph:{type:'website',locale:'en_NG',url:absoluteUrl(path),siteName,title:fullTitle,description,images:[socialImage]},twitter:{card:'summary_large_image',title:fullTitle,description,images:[{url:socialImage.url,alt:socialImage.alt}]}};
}
