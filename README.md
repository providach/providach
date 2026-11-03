# Providach Limited

Next.js App Router homepage and supporting About, Services, Projects, and Contact pages. Manrope and Plus Jakarta Sans load through next/font. Motion provides reduced-motion-aware editorial reveals; photography is served locally through next/image.

## Run

```sh
npm install
npm run dev
```

Validation: `npm run lint`, `npx tsc --noEmit`, `npm run build`. Production: `npm start`. Development output uses `.next/`; production builds use `.next-production/` so a running development preview does not overwrite production verification.

## Consultation delivery

Copy `.env.example` to `.env.local`. Configure `RESEND_API_KEY`, `CONSULTATION_FROM` (a verified Resend sender), and `CONSULTATION_TO`. These settings serve both consultation requests and general enquiries through one server-side delivery utility. Alternatively set `CONSULTATION_STORAGE_DIR` to a private, persistent absolute directory outside public assets. Without either configuration the form returns an honest unavailable error and never displays a false success.

The Node.js POST endpoint validates input, rejects foreign origins, uses a honeypot and minimum completion time, limits payload size, and rate limits requests in memory. In multi-instance production, configure a shared rate limiter or gateway; trust forwarded IP headers only behind your hosting provider’s trusted proxy. File storage requires persistent disk, restricted access, and a retention policy. Email delivery should be verified with your configured sender before launch. Dates and times are requests in Africa/Lagos, not confirmed calendar bookings.

## Content and assets

The supplied raster logo remains the source of truth; CSS frames its original whitespace without changing its proportions. Photographs from Unsplash are illustrative environments, not project documentation. Local editorial assets: hero (photo-1600210492486-724fe5c67fb0), workplace (photo-1497366754035-f200968a6e72), hospitality (photo-1551882547-ff40c63fe5fa), infrastructure (photo-1558494949-ef010cbdcc31), About architecture (photo-1487958449943-2429e8be8625), and About workplace (photo-1497366811353-6870744d04b2), and Services architecture (photo-1486406146926-c627a92ad1ab), and Projects architecture (photo-1542314831-068cd1dbfeeb), and Contact architecture (photo-1497366858526-0766cadbe8fa). Confirm image usage and replace with approved project imagery when available.

Only Lilygate Hotel carries the confirmed date (2020). The engagement framework is explicitly proposed. No client outcomes, testimonials, contact details, or legal pages have been invented.

Portfolio records and category membership live in `components/projects/projectContent.ts`. Unknown client, location, and year fields are omitted. Case-study routes remain unavailable until supported by verified content.

## Contact enquiries

`/contact` has a dedicated general-enquiry form with optional company details and no scheduling fields. `/api/enquiry` validates with the shared Zod schema, bounds request size, checks request origin, applies honeypot and completion-time checks, rate limits valid submissions, and coalesces matching idempotent requests. Delivery must succeed before the form shows a receipt. A failed request preserves the entered details and can be retried.

Idempotency and rate-limit state are bounded to the running server process. Use shared state or provider/gateway controls for multi-instance deployment. Email requests carry a provider idempotency key. Private file storage is an alternative to email; it is not a calendar or a promise of an email notification. Verify a configured email sender with Resend before launch.

Verified public email, phone, WhatsApp, address, and map directions can be added using the `PROVIDACH_PUBLIC_*` variables in `.env.example` before building. Empty or invalid values stay out of the page. No office location, contact number, map pin, or response time is assumed. The enquiry workflow is explicitly proposed positioning.
