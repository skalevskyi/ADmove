# 🚗 SPM — Skalevskyi publicité mobile

Conversion-focused web product for a local mobile outdoor advertising service: vehicle-based exposure, corridor visibility, and local B2B lead capture.

---

## 👀 Preview

<p align="center">
  <img src="./public/readme/desktop.png" width="900"/>
</p>

## 📱 Responsive Experience

<p align="center">
  <img src="./public/readme/laptop.png" width="60%"/>
  <img src="./public/readme/mobile.png" width="30%"/>
</p>

<p align="center">
  <i>Fully responsive conversion website — desktop & mobile optimized</i>
</p>


---

## 📌 About

SPM is a mobile outdoor advertising service website designed for local B2B businesses.

- 🚗 One vehicle (Nissan Qashqai)
- 📍 Fixed daily route (Montpellier → Littoral)
- 🎯 Local audience targeting
- 📊 Predictable visibility model (corridor-based, i18n)
- 🔍 SEO-driven acquisition layer (search-intent pages)

---

## ⚙️ Features

- 🧮 Dynamic pricing calculator (engine + UI separation)
- 📐 Corridor-based visibility model (i18n-driven)
- 📩 Lead capture (`POST /api/lead`, Resend, required durable Upstash backup in production)
- 📱 Responsive, mobile-first UI (bottom nav, safe areas)
- 🌍 Multi-language support (FR / EN / UA)
- ✨ Motion with Framer Motion (reduced-motion aware)
- 🚀 Production deployment on Vercel

## 🔍 SEO Layer

- 3 search-intent pages:
  - /publicite-voiture-montpellier
  - /affichage-mobile-montpellier
  - /publicite-locale-montpellier

- Internal linking:
  - homepage → SEO pages (Hero, Concept, Footer)
  - cross-links between SEO pages

- Technical:
  - dynamic sitemap (`/sitemap.xml`)
  - robots.txt
  - canonical per route

- Google Search Console:
  - sitemap submitted
  - indexing requested

---

## 💰 Pricing & visibility model

- 💸 Pricing lives in the calculator engine (`config.ts`, `rules.ts`, `engine.ts`)
- 👁 User-facing visibility uses **corridor ranges** per format (i18n), not raw engine contact constants
- ⚠️ Internal engine constants are not treated as product truth in messaging
- 📉 CPM in the UI is a **static, corridor-aligned** explanatory line (e.g. ≈ 3.5 € / 1000 local views), not dynamically computed from engine contacts

---

## 🧱 Tech stack

- ⚡ Next.js 15 (App Router)
- ⚛️ React 19
- 📘 TypeScript
- 🎨 Tailwind CSS
- 🎬 Framer Motion
- ☁️ Vercel
- ✉️ Resend
- 🗄 Upstash Redis (lead backup, production)

---

## 🏗 Architecture

- 🧠 **Engine** — calculation logic (`src/lib/calculator/`)
- ⚙️ **Config** — pricing and technical constants (`config.ts`)
- 🖥 **UI** — presentation (`OfferCalculatorPanel`, sections, i18n)

Key principle: strict separation between pricing logic and UI; visibility copy follows the corridor + i18n product rule (see `/SPEC/CALCULATOR_CURRENT_STATE.md`).

---

## 📂 Project structure

```
src/
├── app/                 # App Router, layouts, API routes
├── components/          # UI (sections, shell, offres)
├── lib/
│   ├── calculator/    # Engine, rules, types
│   ├── lead/          # Lead domain, Resend, Redis backup
│   ├── base-path.ts
│   └── site-url.ts
└── i18n/                # Locales (fr, en, ua)
```

---

## 🚀 Deployment

Hosted on **Vercel**. Lead submission uses **`/api/lead`** (Node serverless runtime).

**Required / common environment variables** (see `.env.example`):

```env
NEXT_PUBLIC_SITE_URL=
RESEND_API_KEY=
LEAD_TO_EMAIL=
```

Production requires `RESEND_API_KEY`, `LEAD_TO_EMAIL`, and Upstash Redis REST env vars for durable lead backup. Vercel Marketplace Upstash KV provides `KV_REST_API_URL` + `KV_REST_API_TOKEN`; manual Upstash setup may use `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`. Optional: `RESEND_FROM_EMAIL`, `LEAD_BACKUP_LIST_KEY`, rate limits, `NEXT_PUBLIC_BASE_PATH` for subpath deploys. Local/dev may use `LEAD_BACKUP_SKIP=true`; do not enable it in production.

**Local development**

```bash
npm install
npm run dev
```

**Production build**

```bash
npm run build
npm start
```

---

## 📊 Status

- ✅ Core landing, calculator, and lead pipeline implemented
- ✅ SEO layer (3 pages + internal linking + sitemap)
- ⏳ Indexing in progress (Google Search Console)
- 🎯 UI/UX and copy polish ongoing
- ⏳ Roadmap: FAQ, coverage map, media kit

---

## 👤 Author

**Serhii Skalevskyi** — independent developer & product builder
