# 3rd i Visuals — website

Next.js 15 (App Router) site with a real-time WebGL fluid simulation and a 3D planet with atom-style orbit rings built in React Three Fiber.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Static export (for any static host): `STATIC_EXPORT=1 npm run build` → `out/`.

## What's where

| File | What it does |
| --- | --- |
| `lib/fluid.ts` | GPU Navier–Stokes ink simulation (velocity, pressure, vorticity, glossy shading). Follows the cursor, drifts when idle. |
| `components/Orb.tsx` | The 3D planet: cloud-banded globe shader, three tilted orbit rings with travelling "electrons", particles. Leans toward the cursor. |
| `components/Atmosphere.tsx` | Fixed background layer (fluid + planet), Lenis smooth scrolling, reduced-motion handling. |
| `components/Hero.tsx` | Nav + hero. |
| `components/Services.tsx` | Pinned horizontal service track, approach section with scroll-drawn step rail. |
| `components/Sections.tsx` | E-commerce, content, automation, AI products, work, audience, insights, CTA, enquiry form, footer. |
| `app/services/page.tsx` | Services index (`/services`): hero ring, four service cards, interactive "ecosystem advantage", how we work, ways to engage, AI products, who we work with, work, CTA, enquiry form. |
| `app/services/[slug]/page.tsx` | One route per service: `/services/content-creative`, `/services/ecommerce-growth`, `/services/automation-ai`, `/services/b2b-lead-generation`. Prerendered from `generateStaticParams`. |
| `lib/services.ts` | All copy, section order and accent colours for the four service pages. Edit text here, not in the components. |
| `components/services/ServicePage.tsx` | Renders a service page from its section list (hero, proposition, cards, paths, flow, bands, split, ecosystem, how, three, work, CTA). |
| `components/services/ServicesIndex.tsx` | The services index page. |
| `components/services/SiteNav.tsx` | Header for the inner pages; white over the dark hero, glass bar once scrolled. |
| `public/assets/` | Logo, the photos used on the services pages and the two looping hero videos. Referenced as `/assets/<file>` from `lib/services.ts`. |
| `components/Brand.tsx` | The logo link used in both headers. |
| `app/services.css` | Styles for the services pages (`.sp-*` shared, `.sx-*` index only). |
| `components/Showreel.tsx` | The four YouTube showreels in the "Content that works harder" section: thumbnail at rest, muted autoplay on hover, overlay player on click. Change the video ids in the `reels` list. |
| `components/Contact.tsx` | Lead form (name, email, company, phone, service, message, honeypot) with sending / sent / error states. |
| `app/api/lead/route.ts` | Receives the form, validates and rate-limits it, forwards to a webhook and/or email. |
| `app/globals.css` | Design tokens and all styling. |

## Steering the 3D planet

Every section carries `data-orb="x y scale hue"` (x and y from -1 to 1 across the viewport, hue 0–1 around the
violet → cyan → pink → amber loop). `data-orb-m` overrides it on mobile; scale `0` hides the planet.
Add `data-orb-rel` to make `y` a fraction of the section's own height so the planet scrolls with that section.

## Lead form

Copy `.env.example` to `.env.local` and set where leads should go:

| Variable | What it does |
| --- | --- |
| `LEAD_WEBHOOK_URL` | Every lead is POSTed as JSON here (Zapier, Make, n8n, Google Sheets, your CRM). |
| `RESEND_API_KEY` + `LEAD_TO_EMAIL` | Emails each lead through [Resend](https://resend.com). `LEAD_FROM_EMAIL` must be a verified sender. |
| `NEXT_PUBLIC_LEAD_ENDPOINT` | Static export only. The form posts straight to this URL (Formspree, Web3Forms, …) because there is no API route. |

Leads are addressed to `rupam@3rdivisuals.com` by default. With no key set, the lead is printed to the server console and the visitor's browser opens a pre-filled mail draft to that inbox, so nothing is lost. The route rejects
submissions with a filled honeypot field and allows six per IP every ten minutes.

## Before launch

- Paste a Resend API key into `.env.local` so leads are emailed automatically. Change the inbox with `LEAD_TO_EMAIL` and in the "Prefer email?" link in `components/Sections.tsx`.
- Point the remaining `#` links (case studies, insights) at real routes when those pages exist. Service pages live under `/services`.
- Swap the CSS-drawn placeholders on the home page (content reels, studio shots, insight art) for your own video stills or renders. The services pages already use the photos in `public/assets`; the work cards there still show sample images until real case studies exist.
# 3rdisite
