# SPM — Design System (Skalevskyi publicite mobile)

Visual rules for the Skalevskyi publicite mobile landing page. Style: **modern minimal B2B**, inspired by Stripe, Linear and Vercel. Clean, credible, low visual noise. The product uses a modern minimal B2B typography style.

---

## 1. Color System

### Light mode (default)

| Role | Token / usage | Value | Use |
|------|----------------|--------|-----|
| **Background** | `white` / `slate-50` | `#ffffff`, `#f8fafc` | Page, cards, sections |
| **Surface** | `slate-50` | `#f8fafc` | Alternate section background |
| **Text primary** | `slate-900` | `#0f172a` | Headings, body |
| **Text secondary** | `slate-600` | `#475569` | Supporting copy |
| **Text muted** | `slate-500` | `#64748b` | Labels, captions |
| **Border** | `slate-200` | `#e2e8f0` | Dividers, card outlines |
| **Accent** | `sky-500` / `sky-600` | `#0ea5e9`, `#0284c7` | CTAs, links, focus |
| **Accent hover** | `sky-600` / `sky-500` | Darker / lighter | Button hover |

### Dark mode

| Role | Token / usage | Value | Use |
|------|----------------|--------|-----|
| **Background** | `slate-900` | `#0f172a` | Page |
| **Surface** | `slate-800/50` | `#1e293b` (with opacity) | Cards, sections |
| **Text primary** | `white` | `#ffffff` | Headings, body |
| **Text secondary** | `slate-300` | `#cbd5e1` | Supporting copy |
| **Text muted** | `slate-400` / `slate-500` | `#94a3b8`, `#64748b` | Labels, captions |
| **Border** | `slate-700` | `#334155` | Dividers, card outlines |
| **Accent** | `sky-500` / `sky-600` | `#0ea5e9`, `#0284c7` | CTAs, links |
| **Accent hover** | `sky-400` / `sky-500` | Lighter | Button hover |

### Rules

- **Use one accent color consistently across the entire UI.** Prefer **sky** for interactive elements (primary CTA, links, focus rings). Optional: **slate-900** for primary buttons in light mode instead of sky for stronger contrast. Do not introduce additional accent colors; avoid decorative color variety.
- Prefer **slate** for neutrals; avoid mixing with other gray scales.

---

## 2. Typography

### Font stack

- **Primary font:** **Manrope** (Google Font or local). Used for body and headings.
- **Fallback:** `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
- **Mono:** `ui-monospace`, `monospace` (for code or numbers if needed).

Implementation: Apply Manrope globally (e.g. via Next.js font loader or CSS); use a single sans family across the landing for a consistent modern minimal B2B typography style.

### Scale (Tailwind)

| Use | Class | Approx. size | Line height | Use case |
|-----|--------|--------------|-------------|----------|
| **Hero title** | `text-4xl`–`text-6xl` | 2.25–3.75rem | tight | Hero headline |
| **Section title** | `text-3xl`–`text-4xl` | 1.875–2.25rem | tight | Section H2 |
| **Card title** | `text-xl` | 1.25rem | snug | Format names, card titles |
| **Body large** | `text-lg` | 1.125rem | normal | Intro paragraphs |
| **Body** | `text-base` | 1rem | normal | Default body |
| **Small** | `text-sm` | 0.875rem | normal | Labels, captions, nav |
| **Caption** | `text-xs` | 0.75rem | normal | Footer, legal |

### Weights

- **Headings:** `font-bold` (700). Hero can use `font-semibold` (600).
- **Body:** default (400) or `font-medium` (500) for emphasis.
- **Labels / nav:** `font-medium` (500).

### Rules

- One clear hierarchy: single H1 per page, consistent H2 style for sections.
- Prefer short lines for headlines; body text in readable column width (e.g. `max-w-2xl`–`max-w-3xl`).
- No decorative fonts; keep a single sans family (Manrope + system fallback) across the landing.

---

## 3. Localization Strategy

**Architecture:** FR-first, section-based. Translations live under `src/i18n/` with `locales/fr`, `locales/en`, `locales/ua`. Each locale is split into section files (common, hero, support, parcours, offres, contact). FR is the canonical source; EN and UA must match FR structure exactly. Runtime: custom LanguageContext; whole-locale fallback only (no key-by-key fallback). TranslationKeys derived from FR. All localization files must be UTF-8 clean.

**Proper nouns must not rely on automatic translation.** Use curated labels per locale.

| Location | FR | EN | UA |
|----------|----|----|-----|
| Montpellier | Montpellier | Montpellier | Монпельє |
| Port Marianne | Port Marianne | Port Marianne | Порт-Маріанн |
| Carnon | Carnon | Carnon | Карнон |
| Palavas | Palavas | Palavas | Палавас |
| La Grande-Motte | La Grande-Motte | La Grande-Motte | Ла-Гранд-Мотт |

All place names in the UI (Parcours, hero, footer, etc.) must use these curated values from the `locations` translation object. Do not machine-translate these proper nouns.

---

## 4. Spacing

### Scale (Tailwind)

Use the default Tailwind scale (4px base): `1` (4px), `2` (8px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `16` (64px), `20` (80px), `24` (96px).

### Section spacing

- **Section vertical padding:** `py-16` (64px). Optional `py-20` or `py-24` for hero or key sections.
- **Section inner spacing:** `px-4` `md:px-6` for horizontal padding; `max-w-6xl` or `max-w-4xl` for content width.
- **Gap between elements in a section:** `gap-6` (24px) or `gap-8` (32px) for grids/lists; `space-y-4`–`space-y-6` for stacks.
- **Between heading and body:** `mt-4` (16px); between blocks: `mt-6`–`mt-10`.

### Component spacing

- **Form:** `space-y-4` between fields; `mt-10` above submit.
- **Cards:** internal padding `p-6`.
- **Navbar / Footer:** `py-4` (navbar), `py-8` (footer); horizontal `px-4` `md:px-6`.

### Rules

- Prefer multiples of 4; use `gap-*` and `space-y-*` for consistency.
- Generous whitespace between sections; avoid cramped blocks.

---

## 5. Border Radius

- **Cards / panels:** `rounded-xl` (12px). Optional `rounded-2xl` for hero or feature blocks.
- **Buttons:** `rounded-lg` (8px).
- **Inputs:** `rounded-lg` (8px) to match buttons.
- **Small elements (badges, pills):** `rounded-md` (6px) or `rounded-full` if needed.
- **Images / media:** `rounded-xl` or `rounded-2xl`.

Avoid mixing many radius sizes; stick to `lg` and `xl` for most UI.

---

## 6. Buttons

### Primary (CTA)

- **Background:** `bg-slate-900` (light) or `bg-sky-600` (dark). Hover: `bg-slate-800` / `bg-sky-500`.
- **Text:** `text-white`, `font-medium`, size `text-sm` or `text-base`.
- **Padding:** `px-4 py-2` (compact) or `px-6 py-3` (hero CTA).
- **Radius:** `rounded-lg`.
- **State:** clear hover transition; focus ring (e.g. `focus:ring-1 focus:ring-sky-500 focus:ring-offset-2`).

### Secondary (outline)

- **Border:** `border border-slate-300` (light) / `border-slate-600` (dark).
- **Background:** transparent or `bg-white` / `dark:bg-transparent`. Hover: `bg-slate-50` / `dark:bg-slate-800`.
- **Text:** `text-slate-700` / `dark:text-slate-300`.
- **Padding / radius:** same as primary.

### Rules

- One primary CTA per section (e.g. “Demander un devis”); secondary for “Voir les offres” or similar.
- Buttons are not decorative; no heavy shadows or gradients in this style.

---

## 7. Layout

### Structure

- **Page:** Single column; sections stack vertically. No sidebar on landing.
- **Content width:** `max-w-6xl` for full-width sections (navbar, footer, offres grid); `max-w-4xl` or `max-w-2xl` for text-heavy sections (hero, Process / Support, parcours, contact).
- **Centering:** `mx-auto` on constrained containers; `text-center` only where appropriate (hero, section titles).

### Grid

- **Formats / package cards:** `grid gap-6 md:grid-cols-3` (three columns on desktop).
- **Two-column (e.g. Parcours):** `grid gap-12 md:grid-cols-2 md:items-center`.
- **Mobile:** single column; fixed bottom navigation bar with outline icons (support, Parcours, Offres, Contact). Add bottom padding to main content so the bar does not cover it. Floating action: **scroll-to-top only** (no floating contact button), above the bottom nav when visible. **Mobile bottom nav surface:** floating pill style — **background** `bg-white/80` (light) and `dark:bg-slate-900/80` (dark) for slight transparency; **blur** `backdrop-blur-md`; border, rounded corners (e.g. `rounded-3xl`), subtle shadow; safe-area respected. Active nav item highlighted by color after client mount (hydration-safe).

### Navbar

- Sticky container: `fixed top-0 left-0 right-0 z-50`.
- **Mobile:** full-width top bar with `bg-white/90` / `dark:bg-slate-900/90`, `backdrop-blur-sm` and subtle bottom border (`border-b border-slate-200` / `dark:border-slate-700`).
- **Desktop:** floating, centered panel inside the sticky container — `max-w-6xl mx-auto`, `md:rounded-2xl`, thin border, soft shadow and `backdrop-blur-md`, with logo on the left, section nav in the center, language/theme controls on the right.
- **Nav items (desktop):** inline-flex pill buttons with a small outline icon before the label (same icon set and semantics as mobile bottom nav: Support, Parcours, Offres, Contact). Active item uses a subtle sky-colored pill: `bg-sky-50 text-sky-700` in light mode and `dark:bg-sky-900/30 dark:text-sky-300` in dark mode; icons inherit the text color. Inactive items stay neutral and use soft hover states.
- **Anchor scroll:** desktop anchor navigation is globally compensated using `scroll-padding-top` on `html` so that section headers are not hidden behind the floating navbar.

### Rules

- **All sections must use the same container width rules:** consistent horizontal padding (`px-4 md:px-6`), same max-width convention (`max-w-6xl` for full-width sections, `max-w-4xl` or `max-w-2xl` for text-heavy sections). Do not deviate per section without reason.
- No full-bleed content unless intentional (e.g. a future full-width image).

---

## 8. Motion Rules

- **Library:** Framer Motion. Use sparingly; **motion must remain minimal and professional.** No auto-playing loops, bouncy springs, or distracting motion.
- **Duration:** Keep animation duration in a **subtle range (0.3s–0.5s)**. Example: 0.4s for entrance; optional delay 0.05–0.1s between elements.
- **Entrance:** Short fade + slight vertical move: `opacity` 0→1, `y` 16–20px → 0.
- **Stagger:** For lists or cards, stagger children by 0.06–0.08s; avoid long cascades.
- **Viewport:** Prefer `whileInView` with `viewport={{ once: true, margin: '-60px' }}` so animations run once when section enters view.
- **No:** Animation on every hover except where needed for primary CTAs.
- **Reduced motion:** Respect `prefers-reduced-motion` (disable or simplify animations when set).
- **Hero image rotation:** If the hero uses automatic rotation between vehicle visuals, keep it minimal, slow, and non-distracting. Transitions must remain premium and subtle (e.g. fade + slight scale). Use indicator-based controls only; no arrows, no swipe-heavy behavior, no flashy carousel patterns.
- **Route-based UI (Parcours):** Route timeline uses **live progress visualization**: three marker/segment states — **ACTIVE** (current point, strongest), **FILLED** (path covered in current direction, medium contrast), **MUTED** (not yet covered, light). On forward motion the path fills progressively top to bottom; on backward motion it fades progressively bottom to top (ping-pong). No visited-history; visuals reflect current direction only. Right column is **semi-static**: location title and short description (plus a compact icon/tag row) are dynamic per active point; the **three bullets are semi-dynamic** (change with the active route point), and the previously repeated small note under the bullet list is **not shown** in the current UI. A subtle timeline hint under the left route module explains that clicking a route point pauses viewing and reveals its visibility context. Dynamic part transitions with Framer Motion + AnimatePresence use **opacity-only** swaps (no translate) and must respect prefers-reduced-motion. Route must remain **schematic** (timeline, dots, line), not map-like. No real map UI in the current phase. Right-column bullet icons are slightly larger (e.g. h-5 w-5) for clearer row rhythm. Visibility estimation block: refined typography and spacing; title e.g. “Estimation de la visibilité”; examples use product names BASIC / PRO / EXCLUSIVE with localized placement in parentheses. Motion must stay subtle and purposeful; premium, minimal, calm.
- **Section naming:** The section that explains the advertising medium (id `#support`) uses **UI titles**: FR “Comment ça fonctionne”, EN “How it works”, UA “Як це працює”. Navigation label for this item is conversion-aligned (FR “Fonctionnement”, EN “Process”, UA “Як працює”). It explains the medium (mobile visibility, daily presence, simple message), not the route or the formats.

---

## 9. Imagery Rules

- **Vehicle:** **Real vehicle mockups are preferred over abstract placeholders once available.** Use a real or high-quality mockup of the Nissan Qashqai (with or without wrap). Prefer neutral background or context (street, parking). No clip-art or low-res placeholders in production. Until a real asset is integrated, a minimal visual placeholder is acceptable. **Route/coverage in Parcours:** Represent as schematic UI (timeline, route points, line); no map tiles or real map integration in the current phase.
- **Icons:** If used, simple line or outline style; single color (e.g. slate or sky). Prefer one icon set; no mixed styles.
- **Photos (future):** Real locations (Montpellier, Littoral) or generic B2B (offices, local business) in a consistent tone. Avoid stock that feels generic or cheerful; calm and professional.
- **Format visuals:** Optional small illustrations or icons per format (Rear / Side / Full); minimal and consistent.
- **Backgrounds:** Prefer solid or very subtle gradients; no busy patterns. Optional: soft gradient or geometric shape for hero only.
- **Aspect ratios:** Hero or vehicle: `aspect-video` (16:9) or 4:3; keep consistent across similar blocks.

---

## Summary

- **Colors:** Slate neutrals + sky accent; support light and dark.
- **Typography:** **Manrope** as primary font, system fallback; clear scale and weights; modern minimal B2B style.
- **Localization:** Curated place names per locale; no machine translation of proper nouns.
- **Spacing:** Consistent section padding and content widths; Tailwind scale.
- **Radius:** `rounded-lg` for inputs/buttons, `rounded-xl` for cards.
- **Buttons:** Primary (solid) and secondary (outline); no decoration.
- **Layout:** Single column, constrained width, simple grid for cards. **Floating actions: scroll-to-top only.**
- **Motion:** Framer Motion, subtle fade/slide, once on scroll; no flashy motion.
- **Imagery:** Real or quality mockup for vehicle; minimal icons; calm, B2B-appropriate visuals.

Reference this document when implementing or refining UI so the landing stays consistent and on-brand.
