import type {NextConfig} from 'next';
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants';

export default function config(phase:string):NextConfig{
 return {poweredByHeader:false,async headers(){return [{source:'/api/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}]},distDir:phase===PHASE_DEVELOPMENT_SERVER||process.env.VERCEL==='1'?'.next':'.next-production'};
}
