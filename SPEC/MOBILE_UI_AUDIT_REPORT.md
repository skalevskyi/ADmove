# SPM — Mobile UI Audit Report

**Date:** 2025-03-14  
**Mode:** Read-only analysis. No code or architecture changes.  
**Viewport focus:** 320px – 430px width.

---

## 1. Critical mobile issues

### 1.1 Anchor targets and fixed bottom nav — content hidden when scrolled

| Item | Details |
|------|--------|
| **Section** | Navigation & Safe Area / Contact / Offres |
| **Problem** | The overlap risk with fixed bottom nav was identified when content sits near the bottom of the viewport after hash navigation. In the current Phase 2A UI iteration, this was mitigated by using safe-area–aware bottom padding for the main content, keeping CTAs tappable above the bottom nav. |
| **Reason** | Main bottom padding on mobile now includes safe-area (`pb-[calc(6rem+env(safe-area-inset-bottom))]`), so the last visible content row stays above the floating bottom nav even on devices with a home indicator. |
| **Suggested UI direction** | Re-verify on the smallest screens only. If any rare overlap is still observed, consider adding `scroll-margin-bottom` to the affected anchors as a follow-up. |

### 1.2 Contact section — submit button can sit under bottom nav

| Item | Details |
|------|--------|
| **Section** | Contact |
| **Problem** | The identified “submit under nav” risk is mitigated in the current Phase 2A UI iteration because the main content uses safe-area–aware bottom padding, keeping the submit button above the floating bottom nav in typical scroll positions. |
| **Reason** | Main safe-area–aware bottom padding reduces the chance that end-of-section content is covered by the bottom nav. |
| **Suggested UI direction** | If you observe an edge case on a very small viewport, consider a mobile-only increase in Contact bottom padding, but re-check first to avoid unnecessary layout changes. |

---

## 2. Moderate UX issues

### 2.1 Main bottom padding vs. nav height and safe area

| Item | Details |
|------|--------|
| **Section** | Navigation & Safe Area |
| **Problem** | The identified mismatch between bottom nav height and main content padding was mitigated in Phase 2A by using safe-area–aware bottom padding for the main content. |
| **Reason** | Main bottom padding on mobile now includes safe-area (`pb-[calc(6rem+env(safe-area-inset-bottom))]`). |
| **Suggested UI direction** | No change required; re-verify on the smallest viewports. |

### 2.2 Parcours route markers — small touch and visual size on mobile

| Item | Details |
|------|--------|
| **Section** | Parcours |
| **Problem** | Route marker buttons are `h-6 w-6` (24px). The inner dot is `h-2.5 w-2.5` (active), `h-2 w-2` (filled), or `h-1.5 w-1.5` (muted). 24px is below the common 44px minimum recommended for touch targets; the dots are small for quick visual scanning. |
| **Reason** | Layout is compact and not tuned for touch size on small viewports. |
| **Suggested UI direction** | On narrow viewports (e.g. max-width 430px), consider increasing the marker hit area (e.g. min 44px) and/or the dot size so that taps are easier and the route state is easier to read at a glance. The label is also a button, so combined tap area exists but could be clearer. |

### 2.3 Offres cards — fixed min-height can create uneven or excessive height

| Item | Details |
|------|--------|
| **Section** | Offres |
| **Problem** | Each card uses `min-h-[360px]`. On 320px width, when content is short or varies by locale, cards can feel overly tall or uneven in height when stacked. |
| **Reason** | Single min-height for all breakpoints; no mobile-specific reduction or removal. |
| **Suggested UI direction** | On mobile, consider a smaller min-height (e.g. `min-h-0` or a lower value like `min-h-[280px]`) or remove the min so card height follows content and cards stack more naturally. |

### 2.4 Parcours visibility block — note font size

| Item | Details |
|------|--------|
| **Section** | Parcours (right column) |
| **Problem** | The previously repeated shared note under the bullet list was removed in the current UI iteration, so this readability concern no longer applies. |
| **Reason** | The redundant helper line under the Parcours right-side bullets is no longer rendered. |
| **Suggested UI direction** | No change required. |

### 2.5 Hero — first-screen density and height on 320px

| Item | Details |
|------|--------|
| **Section** | Hero |
| **Problem** | On 320px, the hero stacks: headline (text-4xl, can wrap to 3–4 lines), subheadline (text-lg), trust line (text-sm), two stacked CTAs (flex-col below sm), then a 4:3 image. The first screen may show only the headline and part of the subheadline; trust line and CTAs can sit below the fold. The hero can feel long before reaching Support. |
| **Reason** | Single-column layout with fixed typography scale and aspect-ratio image; no mobile-specific reduction of vertical spacing or image ratio. |
| **Suggested UI direction** | Optional polish: slightly tighter vertical spacing or a smaller image aspect on very narrow viewports (e.g. 320–375px) so that at least headline + subheadline + one CTA are above the fold, or accept current density and ensure CTAs are discoverable with minimal scroll. |

---

## 3. Minor polish suggestions

### 3.1 Scroll-to-top button position

| Item | Details |
|------|--------|
| **Section** | FloatingActions |
| **Observation** | Button uses `bottom-[calc(4rem+env(safe-area-inset-bottom)+0.5rem)]`, so it sits above the nav. Position is consistent and clear. |
| **Suggested UI direction** | No change required. Optional: ensure the button does not overlap critical content (e.g. last Offres CTA) on 320px; current right positioning is generally safe. |

### 3.2 Support section — bullet list spacing

| Item | Details |
|------|--------|
| **Section** | Support (ConceptSection) |
| **Observation** | The Support section is no longer a text-heavy bullet list; it is a concise 4-step explanatory flow. The old bullet-list spacing recommendation is no longer applicable. |
| **Suggested UI direction** | No change required. |

### 3.3 Parcours visibility card density

| Item | Details |
|------|--------|
| **Section** | Parcours (visibility estimation block) |
| **Observation** | Card uses `px-6 py-5`, `text-xs` for the label, `text-sm` for the list. On 320px the hierarchy is clear but the block could feel a bit dense. |
| **Suggested UI direction** | Optionally increase internal spacing (e.g. `py-6` or `space-y-3`) on mobile for a calmer reading. |

### 3.4 Body overflow on very long words

| Item | Details |
|------|--------|
| **Section** | Global (globals.css / layout) |
| **Observation** | `body` has no `overflow-x: hidden`. Very long unbroken strings (e.g. URLs or long words in some locales) could cause horizontal scroll on 320px. |
| **Suggested UI direction** | Consider `overflow-x-hidden` on `html` or `body` as a safeguard, and ensure long text uses `break-words` or similar where needed. |

### 3.5 Offres calculator placeholder — CTA above nav when expanded

| Item | Details |
|------|--------|
| **Section** | Offres |
| **Observation** | When a card’s calculator is expanded, the inner CTA (“Demander une estimation”) can sit near the bottom of the card. With Phase 2A safe-area–aware main padding, it should usually remain above the nav after scroll; see Critical 1.1 for context. |
| **Suggested UI direction** | Once scroll-margin and/or main padding are updated (see 1.1), no extra change needed; optionally add a small bottom padding to the expanded calculator block on mobile so the CTA is clearly above the nav. |

---

## 4. Tailwind / CSS notes (320–430px)

| Topic | Finding |
|-------|--------|
| **Fixed heights** | Offres cards: `min-h-[360px]` — see 2.3. No other problematic fixed heights in Hero or other sections. |
| **Flex / grid** | Hero CTAs use `flex-col` below `sm` (stacked) — good. Parcours uses single-column grid with `gap-12` on mobile — good. Offres stacks cards with `gap-6` — good. |
| **Breakpoints** | 320–430px use default (no `sm`/`md`). No breakpoint-related bugs in the audited components. |
| **Margins / paddings** | Section padding is consistent (`px-4`, `py-16`). Mobile bottom padding is now safe-area aware to prevent nav overlap. |

---

## 5. Summary

- **Critical:** Bottom-nav overlapping risk was mitigated in Phase 2A by safe-area–aware main bottom padding (CTAs remain tappable); scroll-margin-bottom remains an optional follow-up for rare edge cases.
- **Moderate:** Parcours timeline readability remains a focus area; current improvements include a calmer autoplay cadence and a subtle interaction hint.
- **Still open (re-verify):** Offres mobile polish and Contact CTA tapability on the smallest viewports.
- **Minor:** Support bullet spacing note is obsolete (Support is now a 4-step flow). scroll-to-top positioning is already well placed.

No code was modified; this report is analysis only and can be used to prioritize mobile UX fixes.

---

## 6. Resolved in latest UI iteration

The following items have been addressed in post-audit implementation (documentation updated to match):

| Area | Status | Note |
|------|--------|------|
| **Navigation / hydration** | **FIXED** | MobileBottomNav uses a mounted guard; initial render is neutral (no active item); hash + scroll active-state logic runs only after client mount. SSR and initial client HTML match; hydration mismatch removed. |
| **Mobile nav background** | **Improved** | Nav surface uses **bg-white/80** and **dark:bg-slate-900/80** for slightly more transparency; blur (**backdrop-blur-md**), border, rounded shape, and safe-area handling unchanged. |
| **Parcours mobile alignment** | **Improved** | Route module is a **centered compact block** on mobile: inner container uses **w-fit** (content-sized) on mobile and **md:w-full md:max-w-xs** on desktop so the timeline is visually centered; marker column left, labels right (single-row layout). |
| **Main bottom padding** | **Addressed** | Main uses safe-area–aware bottom padding on mobile (`pb-[calc(6rem+env(safe-area-inset-bottom))]`); scroll-to-top button positioned above floating nav. |
| **Parcours autoplay cadence** | **Improved** | Auto-rotation interval was softened for a calmer, easier-to-follow browsing pace. |
| **Timeline interaction hint** | **Implemented** | A subtle one-line hint was added under the left route timeline to clarify the click interaction (pause + context). |
| **Parcours right-side copy** | **Updated** | Right-side benefits are now semi-dynamic by active route point; the redundant shared note under bullets was removed. |
| **Visibility estimation presentation** | **Improved** | The estimation block uses a more polished mini-card presentation for BASIC / PRO / EXCLUSIVE. |

Historical audit sections (1–5) remain for context; the above reflects current implementation state.
