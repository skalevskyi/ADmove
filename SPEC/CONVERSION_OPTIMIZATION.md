# SPM Landing – Conversion Optimization Guide

Recommendations for improving conversion, value proposition, and package presentation on the SPM landing page. This document aligns with existing SPEC and business documentation and does not replace them.

---

## 1. Hero Improvements

**Objectives**

- Communicate value immediately.
- Show scale of visibility.
- Keep the SEO phrase “publicité mobile Montpellier”.
- Improve CTA logic.

**Recommendations (not fully implemented in Phase 2A UI)**

- **Stronger value proposition headline**  
  Lead with the benefit (local visibility, daily presence) and keep “publicité mobile Montpellier” (or equivalent per locale) for SEO. Avoid generic or vague headlines.

- **Highlight potential monthly contacts**  
  Surface one clear number (e.g. “jusqu’à ~200 000 contacts / mois sur le parcours”) so visitors grasp reach without scrolling.

- **Clarify route coverage**  
  Briefly name the route (Montpellier → Littoral) so geography is obvious above the fold.

- **Social proof line**  
  Add a short, credible line (e.g. “Visibilité locale pour commerces et professionnels”) to reinforce B2B positioning.

**CTA correction**

| CTA              | Current (Phase 2A)    | Recommended target | Rationale |
|------------------|------------------------|--------------------|-----------|
| **Primary CTA**  | “Demander une estimation” | Contact (#contact) | Direct path to lead capture; “estimation” matches the product. |
| **Secondary CTA**| “Voir le parcours”    | “Voir le parcours” → #parcours | Parcours explains the medium and route before pricing; reduces confusion and builds trust before contact. |

**Why this improves conversion**

- Value and scale are clear at first glance.
- CTAs match intent: primary = request estimate, secondary = understand the route.
- SEO and messaging stay aligned with “publicité mobile Montpellier”.

---

## 2. “Process / Fonctionnement” Section (Support) Improvement

In Phase 2A, the Process / Support section is already presented as a short visual flow. Keep it concise and avoid route breakdown or package/price numbers inside this section.

**Recommendation (already implemented in Phase 2A): 4-step infographic**

1. **Vehicle circulates daily** – One vehicle, one fixed route (Montpellier ↔ Littoral).
2. **Visibility from traffic and pedestrians** – Exposure while driving and when parked.
3. **Repeated route exposure** – Same route every day; repeated message exposure.
4. **Cumulative exposure** – Same route repeated every day builds accumulated visibility over time.

**Goal**

- Make “how the medium works” understandable at a glance.
- Support the credibility of visibility numbers introduced later (Parcours, Offres).

---

## 3. Parcours Section Optimization

Visibility figures (Rear / Side / Full) are more convincing when the methodology is explained first.

**Recommendation: methodology before numbers**

Before showing estimated contact figures, add a short block explaining that visibility is based on:

- Daily route circulation.
- Local traffic exposure (driving and parking).
- Visibility to drivers and pedestrians.
- Route repetition (same path every day).

Then present the estimated contact figures (e.g. BASIC ~110k, PRO ~150k, EXCLUSIVE ~200k contacts/month) as outputs of this methodology.

**Goal**

- Increase trust in the numbers.
- Align with existing visibility methodology (e.g. visibility_model.md) without overloading the page.

---

## 4. Offres Section – Value Stacking

The section currently describes formats but does not strongly sell them. Value stacking improves perceived benefit before contact.

**Recommendations**

- **Visibility figures per format**  
  (Future polish) Show the indicative monthly contact range next to each format so visitors see reach at a glance. In the current Phase 2A UI, visibility figures live in Parcours, not Offres.

- **Indicative starting price**  
  (Future polish) Use clearly indicative wording, e.g. “à partir de ~250 €/mois”, “à partir de ~450 €/mois”, “à partir de ~750 €/mois”. Never present a fixed pricing ladder; pricing remains dynamic per estimation model.

- **Campaign transparency features**  
  Differentiate tiers with reporting and proof (see Section 5).

**Important rule**

- Prices must always be **indicative** (“à partir de ~X €/mois”).
- No fixed price table; final price comes from the estimation/contact flow.

---

## 5. Package Value Differentiation

Add perceived value to higher tiers through “campaign transparency” features, without turning the product into a full-service agency.

**Suggested value ladder**

| Format   | Transparency / proof elements |
|----------|-------------------------------|
| **Rear** | Basic visibility report (e.g. monthly). |
| **Side** | Visibility report (e.g. twice per month) + campaign photos. |
| **Full** | Weekly visibility report + campaign photos and short video + exclusive branding (per product_spec). |

**Goal**

- Clear progression: entry (Rear) → best value (Side) → premium impact (Full).
- Reinforces that visibility is measurable and transparent, supporting trust and conversion.

---

## 6. Package Psychology

**Recommendation: position Side as the “recommended” option**

- **Rear** – Entry / test: low commitment, clear visibility.
- **Side** – Best value: recommended option; balance of visibility and proof (reports + photos).
- **Full** – Premium impact: maximum visibility and exclusivity.

Highlighting the middle tier (Side) as recommended encourages clients to choose it, improving average order value while keeping Rear and Full as clear alternatives.

---

## 7. Footer Simplification

The landing does not need duplicated full navigation in the footer.

**Recommendation: minimal footer**

- **Brand** – SPM.
- **Short positioning line** – e.g. “Publicité mobile Montpellier”.
- **Route coverage** – (optional future polish; not part of current Phase 2A footer UI).

**Example structure**

```
SPM
Publicité mobile Montpellier
```

Navigation (Support, Parcours, Offres, Contact) remains in the navbar and mobile bottom nav; footer stays minimal and on-brand.

---

## 8. Conversion Principles

**Summary**

- **Show scale of visibility early** – Hero communicates reach (monthly contacts + route) so visitors quickly see the opportunity.
- **Visualize how the medium works** – Process / Support explains the medium as a short flow (without placing package numbers/figures inside this section).
- **Increase trust in visibility numbers** – Parcours explains methodology before figures; Offres stays package-focused in Phase 2A.
- **Clearly differentiate package value** – Visibility + indicative price + transparency features (reports, photos, video) create a clear value ladder.
- **Reduce friction before contacting** – Clear CTAs (estimation → Contact, secondary → Parcours), simple footer, and recommended option (Side) guide users toward the next step without clutter.

**Impact on lead generation**

- Stronger value proposition and social proof improve relevance and intent.
- Trust in visibility and methodology supports consideration of higher tiers.
- Clear CTAs and minimal footer reduce distraction and make “Demander une estimation” the obvious next step.
- Package psychology (recommended Side) supports conversion and average value without changing the core product (one vehicle, one route, three formats).

---

*This guide is an addition to the existing SPEC. Implementation should respect PROJECT_CONTEXT, ROADMAP, and product/business documentation (e.g. pricing_model.md, visibility_model.md, product_spec.md).*
