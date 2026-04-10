# SPM — Project Roadmap

## Current Status

- **Phase 2A (UI / Visual MVP):** **Completed**
- **Phase 2B (functionality):** **Substantially complete** for implemented runtime features (contact lead API, emails, calculator engine + UI, structured lead fields `leadOrigin` / `calculatorSummary` where applicable — see `/SPEC/CALCULATOR_CURRENT_STATE.md` §13). **Remaining** roadmap scope: FAQ, coverage map, media kit (below); optional **pricing calibration** / calculator UX polish.
- **Next focus:** FAQ, map, media kit per priority; production hosted on **Vercel**.

### Shipped UX / platform polish (since prior roadmap revision)

Documented here so roadmap status matches the repo; all items are **implemented in code** (verify in `src/` before changing).

- **Hero conversion order:** primary CTA immediately after the scale line; supporting copy + trust; carousel; secondary CTA below — see `HeroSection.tsx`.
- **Shared CTA shape:** `src/lib/cta-shape.ts` (`ctaShapeBase`) aligned across Hero (secondary), Contact, Offres card CTAs, calculator panel links; Hero primary uses equivalent dimensions + gradient.
- **PWA / launch alignment:** `site.webmanifest` theme/background `#ffffff`; `layout.tsx` **`viewport.themeColor`**; inline theme script skips sync `dark` class in **standalone**; `globals.css` explicit `html` backgrounds — reduces splash/first-frame mismatch for installed PWAs.

---

## Phase 1 — Concept

- ✓ concept defined
- ✓ pricing estimation model (no fixed prices; see pricing_model.md)
- ✓ visibility methodology (indicative placeholders; see visibility_model.md)
- ✓ landing wireframe

## Phase 2A — UI / Visual MVP

- ✓ Navbar (desktop: brand, Process / Fonctionnement / Як працює, Parcours / Route, Offres / Offers, Contact / Контакт; language/theme)
- ✓ Hero (real imagery, premium rotator, reduced motion support)
- ✓ **Process / Fonctionnement / Як працює** section (id #support; UI titles per locale; concise 4-step explanatory flow; no route/format breakdown; no package numbers/pricing)
- ✓ Parcours section (route credibility block; id #parcours; schematic timeline with **live ping-pong progress** — aller fill top→bottom; retour established path with fade/mute behind active stop; retour markers filled then mute when passed; **semi-static right column**: dynamic location title + description + compact icon/tag row; **three bullets are semi-dynamic** by active route point; previously repeated note under bullets is not shown; subtle timeline hint under the route module; calmer autoplay interval; visibility block **BASIC / PRO / EXCLUSIVE** — numeric range + unit line (no Range/Fourchette/Діапазон prefix); no map)
- ✓ Offres section (three packages **BASIC / PRO / EXCLUSIVE**; real mockups — **2 / 2 / 3** gallery images per package in `OffresSection.tsx`; **no fixed prices in UI**; per-card **`calculer`** i18n button expands shared **estimation panel** with **live calculator** (engine + UI); inner CTA to #contact)
- ✓ Estimation panel inside Offres (expandable shell; selected format, duration, add-ons, summary, disclaimer; CTA to #contact; backed by `src/lib/calculator`)
- ✓ Contact section — id `#contact`, layout, and form shell (**Phase 2A**). **Functional submission, emails, and contact UX** are **Phase 2B** — **completed** (see Phase 2B bullets below).
- ✓ Footer (compact premium footer with brand/positioning; no duplicated navigation links)
- ✓ Mobile bottom navigation (Process / Fonctionnement / Як працює, Parcours / Route, Offres / Offers / Пропозиції, Contact / Контакт)
- ✓ **Floating actions: scroll-to-top only** (no floating contact button)
- ✓ Reduced motion support (hero, Parcours, section entrances)
- ✓ Responsive layout; main bottom padding for mobile nav
- ✓ Favicon / app icon metadata; brand asset integration (`layout` metadata + `public/logo/*`)
- ✓ **Production deployment:** **Vercel** (Next.js runtime; App Router) — current canonical hosting
- ✓ Localization: **FR-first, section-based** under `src/i18n/locales/{fr,en,ua}`; custom LanguageContext; whole-locale fallback; TranslationKeys from FR; curated place names (FR/EN/UA); Manrope typography; UTF-8 clean
- ✓ Mobile navigation hydration stability fix (mounted guard; no SSR/client active-state mismatch)
- ✓ UA typography stability on mobile (Manrope Cyrillic subset to prevent font fallback)
- ✓ Support section rendering consistency (locale switching does not leave animated steps hidden/partial)
- ✓ Mobile hero vertical rhythm tuning (reduced perceived drift for long UA copy)
- ✓ Mobile bottom nav active shell parity (clearer visual shell without layout shift)
- ✓ Mobile bottom nav discrete active switching (no shared sliding transfer between items)
- ⬜ Final QA (ongoing as needed)

## Phase 2B — Functionality

- ✓ **Contact form submission** — client → **`POST /api/lead`** → server-side validation → lead domain layer → email provider (Resend). **Note:** the current contact form submits **`packageId: null`** (optional package field in schema is not wired from UI). **Structured fields:** **`leadOrigin`** and optional **`calculatorSummary`** when submit follows calculator prefill (see `/SPEC/CALCULATOR_CURRENT_STATE.md` §13).
- ✓ **Contact section UX** — working submit, loading / success / error, inline validation, premium success card, visual polish (Phase 2B contact UX)
- ✓ **Owner notification email** (Resend to `LEAD_TO_EMAIL`)
- 🟨 **Auto-reply email (submitter)** — **implemented in code**; **external delivery to arbitrary recipients** blocked until **verified sender domain / sender identity** in Resend (infrastructure dependency, not a missing UI path). Mark: *pending verified sender domain for production-grade external delivery*
- ✓ **Calculator / estimation logic** (engine + UI; see `/SPEC/CALCULATOR_CURRENT_STATE.md`) — pricing calibration / UX polish may continue
- ✓ **Technical baseline (acquisition):** SEO metadata + `robots.ts` / `sitemap.ts`, minimal Organization JSON-LD, Vercel Analytics + conversion events (`lead_submitted`, `calculator_opened`, `calculator_prefill_used`), lead API rate limit + honeypot + structured logging + **Upstash Redis backup** for leads (`persistLeadBackup` before email)
- ⬜ FAQ (interactive if needed; not part of current landing architecture)
- ⬜ Coverage map (interactive if needed; not part of current landing architecture)
- ⬜ Media kit download (not part of current landing architecture)

## Phase 3 — Marketing

- ⬜ media kit
- ⬜ SEO pages
- ⬜ Google Business profile

## Phase 4 — Sales

- ⬜ outreach list
- ⬜ first clients
- ⬜ case study

---

**Legend:** ✓ completed · 🟨 implemented; blocked or pending external setup · ⬜ pending

**Note:** Current landing does **not** include: Problem, Solution, or a **separate** top-level “Vehicle” marketing section beyond the **Parcours** block (Parcours / route credibility is implemented in **`VehicleSection.tsx`**, id `#parcours`). It does **not** include: Pricing section, Coverage Map, Price Simulator section, FAQ, or Media Kit. Visibility is integrated into Parcours. Pricing is not shown in Offres. **Historical note:** older roadmap lines referred to static export + GitHub Pages; **production is now Vercel** (see PROJECT_CONTEXT.md).
