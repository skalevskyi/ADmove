# SPM — Project Context

**Documentation hierarchy (canonical):** (1) **Code / runtime** — source of truth for **behavior, pricing logic, and API contracts**. (2) **Corridor (i18n ranges)** — source of truth for **product-facing visibility** (contacts / audience reach). (3) **`/SPEC/CALCULATOR_CURRENT_STATE.md`** — runtime-facing behavior for the calculator and contact→lead integration (including structured fields). (4) This file — product/project context. (5) **`/SPEC/ROADMAP.md`** — status and pending scope. (6) **`/SPEC/AI_RULES.md`** — guardrails for tooling. (7) **`/SPEC/AUDIENCE_PRICING_METHOD.md`** — methodology, non-normative for runtime. (8) **`/SPEC/DESIGN_SYSTEM.md`** — design guidance.

## Project Overview

**Skalevskyi publicite mobile (SPM)** is a **micro-OOH (out-of-home) advertising** service: one vehicle, one route, three formats. Advertising is displayed on a branded vehicle that circulates daily on a defined route between **Montpellier** and the **Littoral**, generating local visibility for B2B clients.

## Product Positioning

- **One vehicle.** Nissan Qashqai SUV.
- **One route.** Fixed daily circulation (Montpellier, Port Marianne, Carnon, Palavas, La Grande-Motte).
- **Three formats.** Product identifiers **BASIC**, **PRO**, **EXCLUSIVE** (untranslated in UI) map to **Rear / Side / Full** in product docs. Parcours visibility-estimation block uses these identifiers with localized placement in parentheses (e.g. FR: arrière, latéral, habillage complet). Offres cards use the same identifiers plus positioning lines (`positioningRear` / `positioningSide` / `positioningFull` per locale).
- **Local visibility** for Montpellier and the Littoral.

## Product Concept

- **Type:** Mobile outdoor advertising (vehicle-based).
- **Goal:** Generate advertising leads via a B2B landing page.
- **Model:** One vehicle, fixed route, daily circulation.

## Vehicle

- **Model:** Nissan Qashqai SUV.
- **Role:** Mobile advertising support (rear, sides, full wrap).
- **Usage:** Daily circulation on the defined route.

## Coverage Area

Daily route between (curated place names per locale; see DESIGN_SYSTEM.md — Localization Strategy):

- Montpellier
- Port Marianne
- Carnon
- Palavas
- La Grande-Motte

## Advertising Formats

Visibility-estimation block in Parcours uses **BASIC**, **PRO**, **EXCLUSIVE** (product identifiers, untranslated) with localized placement labels (e.g. FR: arrière, latéral, habillage complet). **Current UI** shows **defendable monthly contact ranges** per format (i18n: one line with ranges, then a **separate** unit line, e.g. `contacts / mois` / `contacts / month` — no “Range / Fourchette / Діапазон” label row). **Displayed ranges** are the **canonical product-facing** description of reach; they follow **`/SPEC/CALCULATOR_CURRENT_STATE.md`** §6 and i18n — not internal numeric constants in `config.ts`. **`/SPEC/AUDIENCE_PRICING_METHOD.md`** is **methodology / non-normative** for sales reasoning. For **pricing and app behavior**, if docs diverge from code, **code wins**; for **visibility messaging**, **corridor + i18n** define the product story. Do not treat **`/SPEC/PRODUCT/visibility_model.md`** (or other PRODUCT docs) as the single source of truth for **current** landing or calculator figures; PRODUCT remains background context. Pricing is determined dynamically via the on-site calculator; no fixed price tables are displayed on the landing (see `/SPEC/PRODUCT/pricing_model.md`).

## Visibility Metrics (Summary)

### Product Visibility Rule

All user-facing statements about audience size must use **corridor ranges** (i18n). Internal engine constants (`INDICATIVE_MONTHLY_CONTACTS`) are **not** product truth and must not appear in UI, copy, or explanatory logic for reach.

- Exposure is modeled from route, traffic, parking and peak-hour multipliers (see product methodology docs).
- **Landing UI** presents **indicative ranges** + unit line, aligned with `/SPEC/CALCULATOR_CURRENT_STATE.md` and i18n — not legacy single-line placeholders such as ~110k/150k/200k as the primary on-page figures.
- **Displayed ranges are canonical** and must **not** be overridden or contradicted by internal engine constants in messaging.

## Target Clients

- Restaurants  
- Real estate agencies  
- Garages  
- Beauty salons  
- Events  
- Local services  

## Value Proposition

- **Local reach:** High visibility in Montpellier and the Littoral.  
- **Flexible formats:** Rear, Side, Full to match budget and goals.  
- **Predictable exposure:** Fixed route and methodology for visibility estimates.  
- **B2B focus:** Offer designed for local businesses seeking affordable, targeted outdoor advertising.

## Project Stack

- **Next.js 15** (App Router), **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **Framer Motion**

## Build & deployment

- **Hosting:** Production runs on **Vercel** (Next.js **App Router** runtime). Typical URL pattern: `*.vercel.app` (plus custom domain if configured in the hosting account). This is the **current canonical** deployment — not static-export-only or GitHub Pages–only. **Public site URL (metadata, emails, canonical, sitemap):** `getPublicSiteUrl()` in `src/lib/site-url.ts` — override with **`NEXT_PUBLIC_SITE_URL`**, default **`https://www.spmads.fr`**. This is **not** the same as the raw Vercel hostname unless you set the env to match your deployment URL.
- **API routes:** Internal routes such as **`POST /api/lead`** (`src/app/api/lead/route.ts`) run on the **Node/serverless** runtime — required for lead capture and email delivery.
- **Build:** `npm run build` / Vercel build — standard Next.js production build (not a static `out/` export as the primary model).
- **Images:** `next/image` with `images.unoptimized: true` (per `next.config.ts`).
- **Optional base path:** If the app is ever served under a subpath, set `NEXT_PUBLIC_BASE_PATH` and use `BASE_PATH` / `withBasePath` from `src/lib/base-path.ts` for `public/` URLs. Default Vercel root deploy uses an empty base path.
- **Legacy:** Older docs may refer to GitHub Pages + static export; that is **not** the active deployment model for the current production site.

## Current Development Phase

- **Phase 2A (UI / Visual MVP):** **Complete** — landing structure, visual sections, responsive UI, motion, localization shell.
- **Phase 2B (functionality):** **Substantially complete** for implemented runtime features; remaining **roadmap** items are FAQ, coverage map, media kit (see `/SPEC/ROADMAP.md`).
- **Delivered in Phase 2B:** Contact **lead capture** end-to-end — client submit → **`POST /api/lead`** → server-side validation (schema) → lead domain layer (types, mapper, provider) → **Resend** email to owner; premium contact UX (loading, success, error, inline validation, success card). **Structured leads:** payloads may include **`leadOrigin`** (`'contact' \| 'calculator'`) and optional **`calculatorSummary`** when submit follows calculator prefill (see `/SPEC/CALCULATOR_CURRENT_STATE.md` §13). **Auto-reply** to the submitter is **implemented in code** and runs **after** owner notification **best-effort** (auto-reply failure is logged and does not fail the lead). **Delivery to arbitrary external addresses** depends on **Resend sender domain / sender identity** verification (infrastructure) — *implemented in code, pending verified sender domain for real external delivery* (not a missing form feature). **Calculator:** **engine + UI** implemented (`src/lib/calculator/`, `OfferCalculatorPanel.tsx`); see `/SPEC/CALCULATOR_CURRENT_STATE.md`.
- **Still pending:** **FAQ**, **coverage map**, **media kit** download — unchanged vs roadmap. **Calculator:** implemented (**engine + UI**); pricing calibration / polish may still evolve — see `/SPEC/CALCULATOR_CURRENT_STATE.md`.

## Current UI Status

- **Landing structure (`src/app/page.tsx`):** **Navbar** → **`<main>`** (safe-area padding): **Hero** → **Process / Fonctionnement / Як працює** (`ConceptSection`, id `#support`) → **Parcours** (`VehicleSection`, id `#parcours`) → **Offres** → **Contact** → **Footer** (`Footer.tsx`, **inside** `<main>`) → **`</main>`** → **MobileBottomNav** → **FloatingActions** (scroll-to-top). Responsive layout in place.
- **Desktop navbar:** Logo, center nav (conversion-aligned labels from i18n: Fonctionnement / Process / Як працює, Parcours / Route, Offres / Offers / Пропозиції, Contact / Контакт), language/theme. Brand links to #hero.
- **Mobile:** Fixed bottom navigation bar (floating style: rounded, transparent background **bg-white/80** / **dark:bg-slate-900/95**, **backdrop-blur-md**) — matches `MobileBottomNav.tsx`. Outline icons. **Hydration-safe:** MobileBottomNav uses a mounted guard so active-item highlighting runs only after client mount (no SSR/client mismatch). Main content has bottom padding for nav. **Active-state behavior:** click sets active item immediately; state change is discrete (press/release) with no shared sliding pill transfer. **Floating actions: scroll-to-top only** (no floating contact button); appears above bottom nav after scroll threshold.
- **UA typography stability:** Manrope font loader includes the **Cyrillic** subset for UA so Cyrillic text does not fall back to a different font and change text metrics/wrapping.
- **Hero:** Real vehicle imagery; premium minimal rotator; reduced motion support. **Hero headline MUST contain the phrase "publicité mobile Montpellier"** (FR or equivalent per locale) for SEO. Copy fields in i18n (`hero.ts`): **headline**, **subheadline**, **scale** (order-of-magnitude contacts line), **scaleSupporting** (supporting range explainer), **trust** (B2B audience). Route context appears in **subheadline** / carousel labels where needed — there is **no** separate **`route`** string key. **CTAs:** primary **→ #contact**, secondary **→ #parcours**. **DOM order (current implementation):** headline → subheadline → scale → **primary CTA** → scaleSupporting → trust → **image carousel** (second grid column on desktop; follows document order on mobile) → **secondary CTA**. **Shared CTA shape:** `src/lib/cta-shape.ts` exports **`ctaShapeBase`** for consistent padding, radius, and typography — used directly on Hero secondary, Contact submit, Offres card buttons, calculator panel links; Hero primary uses **equivalent** shape dimensions with an inline sky **gradient** (not the shared string import). **PWA / install chrome:** `public/logo/site.webmanifest` sets `theme_color` / `background_color` to `#ffffff`; `src/app/layout.tsx` exports **`viewport.themeColor: '#ffffff'`**; the inline boot script avoids synchronously toggling `html.dark` in **standalone** display mode so the first paint can align with that contract; `globals.css` sets explicit `html` background colors. Copy is concrete and B2B-focused.
- **Process / Support** (section id `#support`; **UI titles:** FR "Comment ça fonctionne", EN "How it works", UA "Як це працює"): Explains how the medium works via a short **4-step flow** (daily route/movement, real exposure, repetition, accumulation) plus a **methodology** sub-block (`methodologyTitle` / `methodologyText` in i18n). Exact strings live in `src/i18n/locales/*/support.ts`. It does **not** include a route-by-route breakdown or package numbers/pricing; visibility methodology and figures live in Parcours.
- **Support render consistency:** ConceptSection animated steps use locale-invariant keying so locale switching does not leave steps hidden/partial.
- **Parcours** (section id `#parcours`): Schematic route credibility block. **Left column:** Compact route timeline (Montpellier → Port Marianne → Carnon → Palavas → La Grande-Motte) with **live progress visualization** (autoplay ping-pong **aller** ↔ **retour**). **Aller:** segments fill **top → bottom** as the active stop advances. **Retour:** the path reads as **already established** (dark segments toward Montpellier); segments **behind** the active stop (already passed on the return leg) **mute/fade**; this is not a second route “drawing upward” from scratch. **Markers — retour:** non-active stops start **filled** (sky dot); stops **passed** on the return trip **mute** progressively; upcoming stops stay at normal fill. **Aller:** classic past = filled dot, future = light dot. **Right column: semi-static** — location title, short description, and a compact icon/tag row are dynamic per active route point; the **three bullets are semi-dynamic** (they change with the active route point). The repeated small note under the bullet list is **not** shown in the current UI. A subtle timeline hint under the left route module explains that clicking a route point pauses viewing and reveals its visibility context. Descriptions per location remain short and exposure-oriented. **Visibility-estimation block** (inside Parcours): title from i18n `visibilityBlockTitle`; cards show **BASIC / PRO / EXCLUSIVE** with localized placement, **numeric range** on one line and **unit** (`contacts / …`) on the line below — no “Range / Fourchette / Діапазон” prefix. Reduced motion supported.
- **Offres:** Section id `#offres`. Three packages with real vehicle mockups (**BASIC / PRO / EXCLUSIVE** per i18n keys `rear` / `side` / `full`). **Image galleries:** BASIC and PRO use **two** images each; EXCLUSIVE uses **three** (`OFFRES` in `OffresSection.tsx`). Card preview shows the **first** image; opening the gallery uses **`OffreLightbox`** — marker dots, pointer-based swipe (with `touch-pan-y` on the swipe surface), keyboard; **no** separate prev/next arrow controls. **Mobile (narrow viewport):** zoom in/out controls, pinch-to-zoom, and pan when zoomed — implementation in `OffreLightbox.tsx`. **Fixed prices are not displayed** on the landing. Per-card primary button label is **`calculer`** in i18n — expands a shared **estimation panel** below the cards (`simTitle`, `hint`, selected format, disclaimer) backed by the **real calculation engine** (`src/lib/calculator/`, UI in `OfferCalculatorPanel.tsx`). Inner CTA **→ #contact** (`ctaEstimation`). See `/SPEC/CALCULATOR_CURRENT_STATE.md` for runtime behavior.
- **Contact:** Section id `#contact`. **Functional lead capture** — submits to **`POST /api/lead`** (fetch uses `withBasePath` for subpath deploys), server validation, structured JSON error responses (`error` codes in `src/lib/lead/types.ts`, including **`backup_failed`** when durable backup cannot be written), **light server-side rate limit** per IP, **honeypot** (`website`, hidden). **Lead pipeline order:** validate → map to `Lead` → **`persistLeadBackup`** (Upstash Redis `LPUSH` to a list — `src/lib/lead/persistence.ts`; env `UPSTASH_REDIS_REST_*`, optional `LEAD_BACKUP_LIST_KEY`, default key `spm:leads:backup`) → **owner notification** (Resend) → **auto-reply** best-effort. If backup fails before email, API returns **503** and the user sees a safe error (`submitErrorBackup` i18n). If backup succeeds but owner email fails, API still returns **200** (`ok: true`); the lead remains **recoverable from Redis** — check structured logs (`owner_email_failed_after_backup`, `lead_processing_complete`). **Operational retrieval:** Upstash console → Redis → inspect the backup list key (newest entries first via `LPUSH`); no in-app dashboard. **Local/dev:** `LEAD_BACKUP_SKIP=true` skips backup (logged) — **not for production.** The form **sends `packageId: null`**. **Structured fields:** **`leadOrigin`** / optional **`calculatorSummary`** per `/SPEC/CALCULATOR_CURRENT_STATE.md` §13. **Calculator → contact prefill:** §6.2 / §13. **Analytics:** `trackSpmEvent`. **Auto-reply / Resend** verification: see Current Development Phase.
- **Footer:** Compact premium footer: logo, brand line, positioning line, copyright + tagline (`src/components/Footer.tsx`). **No** section navigation links (single column; avoids duplicating the navbar).
- **Localization:** **FR-first, section-based.** Translations under `src/i18n/locales/{fr,en,ua}`; section files per locale. Custom LanguageContext; whole-locale fallback only. TranslationKeys derived from FR. Curated place names (FR/EN/UA) per DESIGN_SYSTEM. UTF-8 clean.
- **Accessibility / UX:** Reduced motion, focus states, smooth scrolling with reduced-motion fallback.

---

*Full product and business logic: /SPEC/PRODUCT/ and /SPEC/BUSINESS/. Cross-references: website_spec.md, product_spec.md, pricing_model.md, visibility_model.md.*
