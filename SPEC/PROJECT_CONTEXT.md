# SPM — Project Context

## Project Overview

**Skalevskyi publicite mobile (SPM)** is a **micro-OOH (out-of-home) advertising** service: one vehicle, one route, three formats. Advertising is displayed on a branded vehicle that circulates daily on a defined route between **Montpellier** and the **Littoral**, generating local visibility for B2B clients.

## Product Positioning

- **One vehicle.** Nissan Qashqai SUV.
- **One route.** Fixed daily circulation (Montpellier, Port Marianne, Carnon, Palavas, La Grande-Motte).
- **Three formats.** Product identifiers **BASIC**, **PRO**, **EXCLUSIVE** (untranslated) are used in the Parcours visibility-estimation block; localized placement descriptions in parentheses (e.g. FR: arrière, latéral, habillage complet). Offres section may use format labels per current implementation.
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

Visibility-estimation block in Parcours uses **BASIC**, **PRO**, **EXCLUSIVE** (product identifiers, untranslated) with localized placement labels (e.g. FR: arrière, latéral, habillage complet). Approximate visibility: BASIC ~5 000/day, ~110 000/month; PRO ~7 000/day, ~150 000/month; EXCLUSIVE ~9 000/day, ~200 000/month (indicative placeholders). Methodology in `/SPEC/PRODUCT/visibility_model.md`. Pricing is determined dynamically via an estimation model; no fixed prices are displayed on the landing in Phase 2A (see `/SPEC/PRODUCT/pricing_model.md`).

## Visibility Metrics (Summary)

- Exposure based on route, traffic, parking and peak-hour multipliers.
- Current numbers are indicative placeholders; final numbers will be derived from the methodology described in visibility_model.md.

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

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## Current Development Phase

- **Phase:** UI-only (visual landing page foundation) for SPM. No backend, no API, no form submission, no calculator logic, no interactive map, no media kit download logic.
- **Goal:** Build and refine the visual landing page — structure, layout, styling, responsiveness, transitions and animations.
- **Functionality** (form submission, API, calculators, data persistence, backend) is intentionally postponed until after UI validation (Phase 2B and later).

## Current UI Status

- **Landing structure (in order):** Navbar, Hero, **Process / Fonctionnement / Як працює** (section id `#support`), Parcours, Offres, Contact, Footer. Responsive layout in place.
- **Desktop navbar:** Logo, center nav (conversion-aligned labels from i18n: Fonctionnement / Process / Як працює, Parcours / Route, Offres / Offers / Пропозиції, Contact / Контакт), language/theme. Brand links to #hero.
- **Mobile:** Fixed bottom navigation bar (floating style: rounded, transparent background **bg-white/80** / **dark:bg-slate-900/80**, **backdrop-blur-md**); outline icons. **Hydration-safe:** MobileBottomNav uses a mounted guard so active-item highlighting runs only after client mount (no SSR/client mismatch). Main content has bottom padding for nav. **Floating actions: scroll-to-top only** (no floating contact button); appears above bottom nav after scroll threshold.
- **Hero:** Real vehicle imagery; premium minimal rotator; reduced motion support. **Hero headline MUST contain the phrase "publicité mobile Montpellier"** (FR or equivalent per locale) for SEO. Hero messaging emphasizes **visibilité locale**, **présence sur un parcours**, **répétition quotidienne**. CTAs: **primary → #contact**, **secondary → #parcours**. Structure: **headline**, **subheadline/support line**, **trust line**. Copy is concrete and B2B-focused.
- **Process / Support** (section id `#support`; **UI titles:** FR "Comment ça fonctionne", EN "How it works", UA "Як це працює"): Explains how the medium works via a short **4-step flow** (daily route/movement, real exposure, repetition, accumulation) with a lightweight methodology note. It does **not** include a route-by-route breakdown or package numbers/pricing; visibility methodology and figures live in Parcours.
- **Parcours** (section id `#parcours`): Schematic route credibility block. **Left column:** Compact route timeline (Montpellier → Port Marianne → Carnon → Palavas → La Grande-Motte) with **live progress visualization**. Markers and line segments use three states: **ACTIVE** (current point, strongest), **FILLED** (path covered in current direction), **MUTED** (not yet covered). On forward motion the path fills progressively top to bottom; on backward motion it fades progressively bottom to top (ping-pong). This is **not** visited-history; it is live route visualization. **Mobile:** Route module is a **centered compact block** (content-sized on mobile via `w-fit`; marker column left, labels right). Route autoplay runs on a calmer cadence for readability. **Right column: semi-static** — location title, short description, and a compact icon/tag row are dynamic per active route point; the **three bullets are semi-dynamic** (they change with the active route point). The repeated small note under the bullet list is **not** shown in the current UI. A subtle timeline hint under the left route module explains that clicking a route point pauses viewing and reveals its visibility context. Descriptions per location remain short and exposure-oriented. **Visibility-estimation block** (inside Parcours): title e.g. "Estimation de la visibilité"; examples use **BASIC / PRO / EXCLUSIVE** with localized placement in parentheses (e.g. FR: arrière, latéral, habillage complet). Reduced motion supported.
- **Offres:** Section id `#offres`. Three packages with real vehicle mockups. **Fixed prices are not displayed** in the UI in Phase 2A. Per-card CTA “Calculer” expands a calculator **placeholder** only; CTA inside placeholder scrolls to #contact. Real calculator logic in Phase 2B.
- **Contact:** Visual-only form; id `#contact`. No submission logic.
- **Footer:** Compact premium footer with brand/positioning; no duplicated navigation links.
- **Localization:** **FR-first, section-based.** Translations under `src/i18n/locales/{fr,en,ua}`; section files per locale. Custom LanguageContext; whole-locale fallback only. TranslationKeys derived from FR. Curated place names (FR/EN/UA) per DESIGN_SYSTEM. UTF-8 clean.
- **Accessibility / UX:** Reduced motion, focus states, smooth scrolling with reduced-motion fallback.

---

*Full product and business logic: /SPEC/PRODUCT/ and /SPEC/BUSINESS/. Cross-references: website_spec.md, product_spec.md, pricing_model.md, visibility_model.md.*
