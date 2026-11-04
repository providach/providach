import type {Metadata} from 'next';
import type {CSSProperties} from 'react';
import cursorIcon from '@/public/images/icon.png';
import {Manrope,Plus_Jakarta_Sans} from 'next/font/google';
import './globals.css';
import {BrandStructuredData} from '@/components/Seo';
import {siteUrl,siteName,seoPages,socialImage,previewDeployment} from '@/lib/seo';
import {Header,Footer} from '@/components/Shell';
import {WelcomeIntro} from '@/components/WelcomeIntro';
import {ConsultationProvider} from '@/components/Consultation';
const manrope=Manrope({subsets:['latin'],variable:'--font-heading',display:'swap'});
const jakarta=Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-body',display:'swap'});
export const metadata:Metadata={
 metadataBase:new URL(siteUrl),applicationName:siteName,
 title:{default:`${seoPages['/'].title} | ${siteName}`,template:`%s | ${siteName}`},
 description:seoPages['/'].description,
 authors:[{name:siteName,url:siteUrl}],creator:siteName,publisher:siteName,category:'Business technology services',
 robots:previewDeployment?{index:false,follow:false}:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
 openGraph:{type:'website',locale:'en_NG',siteName,url:siteUrl,title:siteName,description:seoPages['/'].description,images:[socialImage]},
 twitter:{card:'summary_large_image',title:siteName,description:seoPages['/'].description,images:[{url:socialImage.url,alt:socialImage.alt}]},
 icons:{icon:[{url:'/favicon.ico',type:'image/x-icon'},{url:'/images/icon.png',type:'image/png'}],apple:[{url:'/images/icon.png',type:'image/png'}]},
 ...(process.env.GOOGLE_SITE_VERIFICATION?{verification:{google:process.env.GOOGLE_SITE_VERIFICATION}}:{}),
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${manrope.variable} ${jakarta.variable}`}><body id="top" style={{'--brand-cursor':`url("/_next/image?url=${encodeURIComponent(cursorIcon.src)}&w=32&q=75") 3 3`} as CSSProperties}><a className="skip-link" href="#main">Skip to content</a><BrandStructuredData/><ConsultationProvider><Header/><main id="main">{children}</main><Footer/><WelcomeIntro/></ConsultationProvider></body></html>}
