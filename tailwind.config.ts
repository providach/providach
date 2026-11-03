import type { Config } from 'tailwindcss';
export default {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{colors:{ink:'#20282B',mint:'#DCE8E1',teal:'#123B35',cream:'#F6F4EE'},fontFamily:{sans:['var(--font-body)','sans-serif'],serif:['var(--font-heading)','sans-serif']}}},plugins:[]} satisfies Config;
