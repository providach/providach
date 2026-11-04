import type {MetadataRoute} from 'next';
import {absoluteUrl,seoPages} from '@/lib/seo';
export default function sitemap():MetadataRoute.Sitemap{
 // Do not fabricate modification dates: add real editorial timestamps when available.
 return Object.keys(seoPages).map(path=>({url:absoluteUrl(path)}));
}
