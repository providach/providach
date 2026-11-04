import type {MetadataRoute} from 'next';
import {absoluteUrl,previewDeployment,siteUrl} from '@/lib/seo';
export default function robots():MetadataRoute.Robots{
 return previewDeployment?{rules:{userAgent:'*',disallow:'/'}}:{rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:absoluteUrl('/sitemap.xml'),host:siteUrl};
}
