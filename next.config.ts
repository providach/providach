import type {NextConfig} from 'next';
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants';

export default function config(phase:string):NextConfig{
 return {poweredByHeader:false,distDir:phase===PHASE_DEVELOPMENT_SERVER||process.env.VERCEL==='1'?'.next':'.next-production'};
}
