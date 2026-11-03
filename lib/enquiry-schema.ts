import {z} from 'zod';
import {services} from '@/components/data';

const names:[string,...string[]]=['General Enquiry',...services.map(service=>service.title)];
export const enquirySchema=z.object({
 name:z.string().trim().min(2,'Please enter your full name.').max(180,'Please use no more than 180 characters.'),
 company:z.string().trim().max(180,'Please use no more than 180 characters.').optional().default(''),
 email:z.string().trim().max(254,'Please check your email address.').email('Please enter a valid work email.').transform(value=>value.toLowerCase()),
 phone:z.string().trim().min(7,'Please enter a valid phone number.').max(40,'Please enter a valid phone number.').regex(/^[+\d\s().-]+$/,'Please enter a valid phone number.').refine(value=>{const digits=value.replace(/\D/g,'');return digits.length>=7&&digits.length<=15},'Please enter a valid phone number.'),
 service:z.enum(names,{message:'Please select a service or General Enquiry.'}),
 description:z.string().trim().min(15,'Please share at least 15 characters about your requirements.').max(5000,'Please use no more than 5,000 characters.'),
 contactMethod:z.enum(['no-preference','email','phone']).optional().default('no-preference'),
});
export type EnquiryValues=z.input<typeof enquirySchema>;
export type EnquiryField=keyof EnquiryValues;
export function enquiryFieldErrors(issues:{path:PropertyKey[];message:string}[]):Partial<Record<EnquiryField,string>>{
 const errors:Partial<Record<EnquiryField,string>>={};
 for(const issue of issues){const field=issue.path[0] as EnquiryField;if(field&&!errors[field])errors[field]=issue.message}
 return errors;
}
