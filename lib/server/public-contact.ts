import 'server-only';

// Public company details must be verified before configuration. Blank values stay out of the UI.
export function getPublicContact(){
 const email=process.env.PROVIDACH_PUBLIC_EMAIL?.trim();
 const phone=process.env.PROVIDACH_PUBLIC_PHONE?.trim();
 const address=process.env.PROVIDACH_PUBLIC_ADDRESS?.trim();
 const phoneValid=!!phone&&/^[+\d\s().-]{7,40}$/.test(phone)&&phone.replace(/\D/g,'').length>=7&&phone.replace(/\D/g,'').length<=15;
 const whatsapp=process.env.PROVIDACH_PUBLIC_WHATSAPP?.replace(/\D/g,'');
 const rawDirections=process.env.PROVIDACH_PUBLIC_MAPS_URL?.trim();
 let directions:string|undefined;
 if(address&&rawDirections){try{const url=new URL(rawDirections);if(url.protocol==='https:')directions=url.href}catch{}}
 return {
  email:email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?email:undefined,
  phone:phoneValid?phone:undefined,
  phoneHref:phoneValid?`tel:${phone!.replace(/[^+\d]/g,'')}`:undefined,
  address:address&&address.length<=500?address:undefined,
  whatsappHref:whatsapp&&/^\d{7,15}$/.test(whatsapp)?`https://wa.me/${whatsapp}`:undefined,
  directions,
 };
}
