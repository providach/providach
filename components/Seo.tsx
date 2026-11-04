import {absoluteUrl,seoPages,siteName,siteUrl,type SeoPath} from '@/lib/seo';
import {getPublicContact} from '@/lib/server/public-contact';
import {serviceDetails} from '@/components/services/serviceContent';

function JsonLd({value}:{value:unknown}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,'\\u003c')}}/>}
export function BrandStructuredData(){
 const contact=getPublicContact();
 return <JsonLd value={{'@context':'https://schema.org','@graph':[
  {'@type':'Organization','@id':`${siteUrl}/#organization`,name:siteName,alternateName:'Providach',url:siteUrl,logo:{'@type':'ImageObject',url:absoluteUrl('/images/logo.png')},image:absoluteUrl('/images/banner.jpg'),description:seoPages['/'].description,areaServed:{'@type':'Country',name:'Nigeria'},...(contact.email?{email:contact.email}:{}),...(contact.phone?{telephone:contact.phone}:{}),...(contact.address?{address:contact.address}:{})},
  {'@type':'WebSite','@id':`${siteUrl}/#website`,name:siteName,alternateName:'Providach',url:siteUrl,inLanguage:'en-NG',publisher:{'@id':`${siteUrl}/#organization`}},
 ]}}/>;
}
export function PageStructuredData({path}:{path:SeoPath}){
 const page=seoPages[path];const url=absoluteUrl(path);
 const type=path==='/about'?'AboutPage':path==='/contact'?'ContactPage':path==='/services'||path==='/projects'?'CollectionPage':'WebPage';
 const graph:Record<string,unknown>[]=[{'@type':type,'@id':`${url}#webpage`,url,name:page.title,description:page.description,inLanguage:'en-NG',isPartOf:{'@id':`${siteUrl}/#website`},about:{'@id':`${siteUrl}/#organization`},primaryImageOfPage:{'@id':`${url}#primaryimage`},...(path!=='/'?{breadcrumb:{'@id':`${url}#breadcrumb`}}:{}),...(path==='/services'?{mainEntity:{'@id':`${url}#services`}}:{})},{'@type':'ImageObject','@id':`${url}#primaryimage`,url:absoluteUrl('/images/banner.jpg'),width:7016,height:4961,caption:'Providach Limited'}];
 if(path!=='/')graph.push({'@type':'BreadcrumbList','@id':`${url}#breadcrumb`,itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:absoluteUrl('/')},{'@type':'ListItem',position:2,name:page.label,item:url}]});
 if(path==='/services')graph.push({'@type':'ItemList','@id':`${url}#services`,name:'Providach technology services',numberOfItems:serviceDetails.length,itemListElement:serviceDetails.map((service,index)=>({'@type':'ListItem',position:index+1,item:{'@type':'Service','@id':`${url}#${service.id}-service`,name:service.name,description:service.description.join(' '),url:`${url}#${service.id}`,serviceType:service.name,provider:{'@id':`${siteUrl}/#organization`},areaServed:{'@type':'Country',name:'Nigeria'}}}))});
 return <JsonLd value={{'@context':'https://schema.org','@graph':graph}}/>;
}
