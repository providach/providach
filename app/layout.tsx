import type {Metadata} from 'next';
import type {CSSProperties} from 'react';
import cursorIcon from '@/public/images/icon.png';
import {Manrope,Plus_Jakarta_Sans} from 'next/font/google';
import './globals.css';
import {Header,Footer} from '@/components/Shell';
import {WelcomeIntro} from '@/components/WelcomeIntro';
import {ConsultationProvider} from '@/components/Consultation';
const manrope=Manrope({subsets:['latin'],variable:'--font-heading',display:'swap'});
const jakarta=Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-body',display:'swap'});
export const metadata:Metadata={title:{default:'Providach Limited | Confidence in Every Connection',template:'%s | Providach Limited'},description:'Thoughtfully engineered technology and infrastructure solutions. IT consultancy, enterprise systems, networking, hospitality technology and dependable support.',openGraph:{title:'Providach Limited | Confidence in Every Connection',description:'Technology that gives businesses the confidence to move forward.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${manrope.variable} ${jakarta.variable}`}><body id="top" style={{'--brand-cursor':`url("/_next/image?url=${encodeURIComponent(cursorIcon.src)}&w=32&q=75") 3 3`} as CSSProperties}><a className="skip-link" href="#main">Skip to content</a><ConsultationProvider><Header/><main id="main">{children}</main><Footer/><WelcomeIntro/></ConsultationProvider></body></html>}
