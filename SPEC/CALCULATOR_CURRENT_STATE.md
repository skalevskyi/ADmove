# CALCULATOR_CURRENT_STATE.md

## 📌 Purpose

This document describes the **actual implemented behavior** of the SPM calculator and (§13) **contact → lead** integration (structured fields, prefill rules).

**Canonical hierarchy:** (1) **Code / runtime** is always authoritative for **behavior, pricing logic, and API contracts**. (2) **This file** is the **canonical runtime-facing spec** for calculator behavior and calculator-related lead payload behavior — update it when implementation changes. (3) Product context: `PROJECT_CONTEXT.md`. (4) Roadmap: `ROADMAP.md`. (5) AI guardrails: `AI_RULES.md`. (6) `AUDIENCE_PRICING_METHOD.md` is **non-normative** methodology.

**Product visibility rule:** For **audience / reach**, the **product truth** is defined **exclusively** by **corridor ranges** implemented in **i18n** (calculator + Parcours + approved copy). **On-screen labels** may use locale-specific wording such as **views / vues / перегляди** (see current `offres.ts` / `parcours.ts` keys — e.g. `calculatorContactsLabel`, `visibilityContactsUnit`). **Internal** numeric constants (`INDICATIVE_MONTHLY_CONTACTS` in `config.ts`) may exist for technical purposes but are **not** used in user-facing explanation, messaging, or product narrative.

If any conflict exists between marketing copy and **pricing/UI behavior**:
→ **implementation (code + UI) wins**; then align this document. For **visibility messaging**, corridor + i18n define the product story even if internal constants differ.

### Product Visibility Rule (summary)

All user-facing **numeric** audience brackets must use **corridor ranges** (i18n). **Wording** of labels/units follows current **`offres` / `parcours`** keys (may say *views* / *vues* / *перегляди* per locale). Internal numeric constants are **not** considered product truth and must **not** appear in UI, copy, or explanatory logic for reach.

---

# 🧠 1. ARCHITECTURE

Calculator is split into 3 independent layers:

### 1. Engine (logic)

```
src/lib/calculator/
- engine.ts
- rules.ts
- config.ts
```

Responsible for:

* pricing calculations
* add-ons logic
* duration multipliers
* totals

---

### 2. Config (data)

```
config.ts
```

Contains:

* base prices
* add-on prices
* optional **internal** field `INDICATIVE_MONTHLY_CONTACTS` (technical only; **not** the product definition of visibility — see §6)
* **first month base-media price fraction:** `FIRST_MONTH_BASE_MEDIA_PRICE_FRACTION` in `config.ts` (currently **0.5** — month 1 base media is **50%** of the **effective** monthly base after the duration multiplier; **all packages**; base media only — see §4.2)

---

### 3. UI (presentation)

```
src/components/sections/OfferCalculatorPanel.tsx
```

Responsible for:

* formatting
* layout
* display logic
* prepaid logic (IMPORTANT: UI-only)

---

# ⚠️ RULE

```
engine → calculates
config → defines numbers
UI → displays

NO mixing responsibilities
```

---

# 📦 2. PACKAGES

| Package   | Base €/month |
| --------- | ------------ |
| BASIC     | 300          |
| PRO       | 490          |
| EXCLUSIVE | 690          |

---

# 📅 3. DURATION MULTIPLIERS

Applied ONLY to base media price:

| Duration  | Multiplier | Discount |
| --------- | ---------- | -------- |
| 3 months  | 1.00       | 0%       |
| 6 months  | 0.95       | 5%       |
| 9 months  | 0.92       | 8%       |
| 12 months | 0.88       | 12%      |

---

# 💰 4. CORE CALCULATIONS (ENGINE)

## 4.1 Effective monthly base (base media)

The duration multiplier applies **only** to base media. In code, **`computeEffectiveBaseMonthlyMediaCents`**:

```
effectiveBaseMonthly = basePrice × durationMultiplier
```

(Engine works in **cents**; amounts are rounded per `rules.ts`.)

---

## 4.2 First month — base media charge

**Source of truth:** `FIRST_MONTH_BASE_MEDIA_PRICE_FRACTION` in `config.ts` (currently **0.5**). Implemented in **`computeBaseMonth1AfterDiscountCents`** (`rules.ts`).

**Rule (all packages, base media only):**

* After the duration multiplier is applied, **month 1** charges **50%** of **effective** monthly base media (not a fixed € amount).
* Add-ons are **not** discounted by this rule; they stack on month 1 at full configured rates as computed by the engine.

```
month1BaseMedia = effectiveBaseMonthly × FIRST_MONTH_BASE_MEDIA_PRICE_FRACTION
```

Equivalently, the **discount** on base media in month 1 equals the other **50%** of `effectiveBaseMonthly` (surfaced in UI as `month1BaseDiscountEur` in `engine.ts`).

---

## 4.3 Recurring months (from month 2)

Base media from month 2 onward uses the **full** effective monthly base:

```
fromMonth2BaseMedia = effectiveBaseMonthly
```

---

## 4.4 Add-ons (monthly)

Each add-on produces:

```
chargedMonthlyEur
```

Engine supports one-time fees via `chargedOneTimeEur` where rules apply (value may be `0` depending on selection and `rules.ts`).

---

## 4.5 Total per month

```
month1Total = month1BaseMedia + recurring add-ons (monthly) + one-time fees (as applicable)
fromMonth2Total = effectiveBaseMonthly + recurring add-ons (monthly)
```

(Exact line items: see `engine.ts` / `CalculatorMonthlyView`.)

---

## 4.6 Contract total

```
contractTotal =
  month1Total +
  (duration - 1) × fromMonth2Total
```

---

# 🧩 5. ADD-ONS (ACTUAL IMPLEMENTATION)

Add-on ids and draft prices are defined in `config.ts` (`ADDON_PRICES`). Current ids:

| Add-on id          | Billing (config) | Draft price (see `config.ts`) |
| ------------------ | ---------------- | ----------------------------- |
| `extra_route_day`  | `monthly` (field in `ADDON_PRICES` in `config.ts`) | €30 / month (fixed; toggle ON/OFF in UI) |
| `photo_reporting`  | monthly          | €20 / month                   |
| `video_reporting`  | monthly          | €40 / month                   |
| `exclusivity`      | monthly          | €120 / month (BASIC), €100 / month (PRO); see `EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE` in `config.ts` |
| `priority_booking` | one-time         | €30 (one-time)                |

---

### Inclusion rules (`INCLUDED_BY_DEFINITION` in `config.ts`):

| Package   | Included by definition (no separate charge line when applicable)      |
| --------- | --------------------------------------------------------------------- |
| BASIC     | none                                                                  |
| PRO       | `photo_reporting`                                                     |
| EXCLUSIVE | `photo_reporting`, `priority_booking`, `exclusivity`                  |

---

### Note:

Availability per package is enforced in `rules.ts` / UI (e.g. which toggles appear). See `config.ts` and `ADDON_AVAILABILITY` for matrix details.

---

# 👁 6. VISIBILITY MODEL

**User-facing visibility** is defined by **corridor ranges** (single product-facing model for **numeric** reach):

| Package   | Monthly range (corridor, product-facing) |
| --------- | ------------------------------------------- |
| BASIC     | 60k–100k                                    |
| PRO       | 100k–150k                                   |
| EXCLUSIVE | 130k–200k                                   |

These values are implemented via **i18n** (`calculatorContactsRange*` in Offres calculator panel; Parcours visibility block) plus **separate label / unit lines**. **Label keys** (e.g. `calculatorContactsLabel`, `calculatorContactsUnit`, `visibilityContactsUnit`) use **locale-appropriate** copy — including **views / vues / перегляди** where implemented — while the **numeric corridor** above stays the canonical bracket. They represent the **only** product-facing description of audience reach. There is **no** separate UI prefix row like “Range / Fourchette / Діапазон” before the numbers.

Add-ons and duration selection do **not** change these displayed ranges (ranges are copy/corridor-based, not dynamically recalculated per selection in the UI).

---

### Internal implementation (non-product layer)

`INDICATIVE_MONTHLY_CONTACTS` (**30 000 / 45 000 / 60 000** per package in `config.ts`) may exist in code for **technical** or legacy engine use. It must **not** be presented as authoritative, canonical, or primary for UX explanation or product messaging. **Do not** surface these integers as the headline for contacts in the calculator or Parcours.

---

### 6.1 `priority_booking` (EXCLUSIVE) — config vs “Inclus” strip

* **Config / engine:** For EXCLUSIVE, `priority_booking` remains **included by definition** in `INCLUDED_BY_DEFINITION` in `config.ts` (one-time fee absorbed in rules when applicable — unchanged).
* **UI:** The visible **“included in package”** list in `OfferCalculatorPanel` **intentionally omits** `priority_booking` as a listed row (filter in UI only). Pricing behavior follows engine/config; the omission is **presentation-only**.

---

### 6.2 Contact form prefill from calculator (cross-UI)

* Calculator CTA can pass a payload via **`CalculatorContactPrefillContext`**; `ContactSection` may fill the message field with a generated summary.
* **Overwrite rule:** A new prefill **replaces** the message only while it is still considered **calculator-generated**. If the user **manually edits** the message, later calculator prefills **do not** overwrite that text automatically.
* After a **successful submit**, the form is reset; a subsequent calculator CTA can apply a **new** prefill again (same overwrite rules).
* Implemented in **`ContactSection.tsx`** only — not in the calculator engine.
* **Lead `packageId`:** The API accepts an optional **`packageId`** on leads, but the **current contact form always submits `packageId: null`** — package selection is reflected in the **prefill message text**, not in that field.

---

# 🧾 7. UI — MONTHLY MODE

## 7.1 Base price block

Shows:

```
Base price (package list / nominal)
= BASE_MONTHLY_MEDIA_EUR[packageId]
```

(from `config.ts`; duration multiplier applies in engine as effective base)

### CPM row (static, corridor-aligned)

Immediately after the base price line, a **static** explanatory row is shown (not computed dynamically by the engine):

* **Label:** `calculatorEstimatedCostCpmLabel` (i18n)
* **Value:** `calculatorEstimatedCostCpmValue` — corridor-aligned **static** copy per locale (e.g. FR **≈ 4 € pour 1000 vues** — see `offres.ts`), consistent with the **corridor** model — **not** derived from `INDICATIVE_MONTHLY_CONTACTS` or a live CPM calculation in code.

---

## 7.2 Adjustments

* **First month base media:** −50% of **effective** monthly base (after duration multiplier), via `FIRST_MONTH_BASE_MEDIA_PRICE_FRACTION` — **base media only**; see §4.2.
* Period discount (UI-derived, not engine — where shown as presentation)

---

## 7.3 Payment structure

```
Month 1 → month1 base media (discounted per §4.2) + add-ons
From month 2 → effective monthly base media + add-ons
```

(Structure mirrors `CalculatorMonthlyView` / engine output.)

---

## 7.4 Add-ons block

* list of selected add-ons
* each shown per month
* total monthly add-ons displayed

---

## 7.5 Final payable (IMPORTANT)

```
To pay:
Month 1 → month1Total
From month 2 → fromMonth2Total
```

👉 ONLY place where full cost is shown

---

## 7.6 Average price

```
avgMonthly = contractTotal / duration
```

---

# 📦 8. UI — CONTRACT MODE

## 8.1 Top contract summary (base only)

```
baseContractAmountEur   (computed in UI, presentation-only)
= month1BaseMediaEur + (durationMonths - 1) × fromMonth2BaseMediaEur
```

The top contract value shows **base-only** amount for the selected period (**without add-ons**). Full contract total including add-ons lives in engine as `contractTotal` / `contractTotalView.contractTotalEur` and is used in the **payable** block, not as this hero row.

---

## 8.2 Payment structure (contract mode)

```
Month 1 → month1BaseMediaEur
From month 2 → fromMonth2BaseMediaEur
```

(Base media only — aligned with monthly mode payment structure; add-ons appear only in the add-ons block and in payable totals.)

---

## 8.3 Add-ons (contract)

Each add-on:

```
monthly × duration
```

Plus:

```
totalAddonsContract
```

---

## 8.4 Payment options

### Monthly:

```
= contractTotal
```

---

### Prepaid (UI only)

```
rate:
3m → 2%
6m → 3%
9m → 4%
12m → 5%

prepaidTotal = contractTotal × (1 - rate)
savings = contractTotal - prepaidTotal
```

---

### Display:

```
Monthly payment
Prepaid discount (−€X + %)
Final prepaid total
```

---

## ⚠️ IMPORTANT

Prepaid logic:

* NOT in engine
* ONLY UI
* conversion tool

---

# 🎯 9. PRICE HIERARCHY (CRITICAL)

Always respect:

```
Base price (package only)
↓
Adjustments (discounts)
↓
Add-ons
↓
FINAL PAYABLE
```

---

## RULE

```
Base ≠ Payable
```

Must be visually distinct

---

# 🎨 10. UI PRINCIPLES

* label left / value right
* final values stronger typography
* discounts = negative values
* add-ons grouped
* CTA below financial summary

---

# 🚫 11. WHAT IS NOT PART OF ENGINE

* prepaid discount
* period discount in €
* formatting
* layout logic

---

# 🧭 12. CURRENT STATUS

Calculator is:

```
✅ UI implemented
✅ Engine working
⚠️ Pricing calibration pending
✅ Add-ons aligned with config.ts and rules.ts
```

---

# 🔒 FINAL RULE

If anything contradicts this file:

```
→ check engine
→ check UI

→ NOT old SPEC
```

---

# 🔗 13. CALCULATOR → CONTACT (ACTUAL IMPLEMENTATION)

Implementation source of truth: `CalculatorContactPrefillContext`, `ContactSection.tsx`, `src/lib/contactPrefillMessage.ts`, `src/lib/lead/*` (types, schema, mapper, `persistence.ts`, `provider.ts`, `providers/email.ts`), `POST /api/lead` (JSON responses include optional `error` codes incl. `backup_failed` — see `LeadApiErrorCode` in `src/lib/lead/types.ts`; client uses `withBasePath('/api/lead')`).

---

## 13.1 Lead structure (ACTUAL)

Leads accepted by the API include (among other fields):

| Field | Type / role |
|-------|----------------|
| `leadOrigin` | `'contact' \| 'calculator'` |
| `calculatorSummary` | Optional object (see §13.2); only present when originating from calculator flow |

| `leadOrigin` value | Meaning |
|--------------------|--------|
| `'contact'` | User filled the form without an active calculator payload tied to submit (cold lead or user cleared calculator association by editing the message after prefill). |
| `'calculator'` | Submit occurred while a calculator prefill payload was still associated with the form (see §13.5–13.6). |

---

## 13.2 `calculatorSummary` (ACTUAL)

Structured payload (validated server-side with Zod). **Not** inferred by parsing the message body.

| Field | Type |
|-------|------|
| `packageLabel` | string |
| `paymentMode` | string (localized billing label, e.g. monthly vs contract total) |
| `durationMonths` | `3 \| 6 \| 9 \| 12` |
| `addons` | `string[]` (human-readable labels when available, else addon ids) |
| `totalPrice` | number (EUR) |

* **Not derived from message:** the UI builds `calculatorSummary` from the same selection used for prefill, not from free text.
* **Consumption:** owner notification email can include a **Calculator Summary** block; auto-reply can include a conditional **configuration** block when `leadOrigin === 'calculator'` and `calculatorSummary` is present.

---

## 13.3 Source of truth

| Layer | Role |
|-------|------|
| `message` | User-visible body (may include calculator-generated prefill text or fully manual text). |
| `calculatorSummary` | Structured fields for email templates and downstream use; **must not** be reconstructed by parsing `message`. |

---

## 13.4 Prefill mechanism (ACTUAL)

1. Calculator CTA builds a **`CalculatorContactPrefillPayload`** (package id, display mode, duration, active addon ids, total EUR) via `buildCalculatorContactPayload` / flow in `contactPrefillMessage.ts`.
2. Payload is stored in **`CalculatorContactPrefillContext`** (`setPayload`).
3. **`ContactSection`** consumes the context: when a payload arrives, it generates the textarea `message` with **`buildContactPrefillMessage(t, payload, locale)`** and clears the context payload after applying.
4. Engine and pricing logic stay in `src/lib/calculator/`; prefill is UI-only regarding the **message string** (see §6.2 cross-reference).

---

## 13.5 Overwrite rule (IMPORTANT)

* **`messageFromCalculatorRef`:** while `true`, the textarea is still treated as calculator-generated; a new prefill from context may replace `message`. While `false`, a new prefill does **not** overwrite an existing non-empty message.
* If the user **edits** the message textarea, **`messageFromCalculatorRef`** and **`lastCalculatorPayloadRef`** are both cleared → subsequent prefills do not overwrite text; submit no longer sends `leadOrigin: 'calculator'` / `calculatorSummary` unless a new prefill is applied.
* **`lastCalculatorPayloadRef`** stores the last applied **`CalculatorContactPrefillPayload`** for **submit** (set when prefill is applied; cleared on message edit, successful submit, and success-state reset).

---

## 13.6 Submit behavior

| Condition on submit | `leadOrigin` | `calculatorSummary` |
|---------------------|--------------|---------------------|
| `lastCalculatorPayloadRef` set (calculator payload still associated) | `'calculator'` | Included (built from that payload + i18n labels) |
| No payload ref | `'contact'` | Omitted |

The contact form **still sends `packageId: null`** (optional field not wired from UI). Package choice is represented inside **`calculatorSummary.packageLabel`** (and related fields) when `leadOrigin === 'calculator'`, not via `packageId`.

---

## 13.7 Reset rules

* **After successful submit:** form resets; association refs clear; a **new** calculator → contact flow can apply prefill again (same overwrite rules as §13.4–13.5).
* **New calculator run:** a new payload from the calculator replaces the previous one in context; the next prefill uses that latest payload only.
* **Offer / selection change:** when the user changes package or calculator inputs and triggers a new prefill toward contact, the new payload supersedes the old one for subsequent prefill application.
