/**
 * Phase 2B calculator — domain types.
 * Pure types only (no business logic).
 */

export type PackageId = 'BASIC' | 'PRO' | 'EXCLUSIVE';

export type DurationMonths = 3 | 6 | 9 | 12;

export type DisplayMode = 'monthly' | 'contract_total';

export type AddonId = 'photo_reporting' | 'video_reporting' | 'extra_route_day' | 'priority_booking' | 'exclusivity';

export type BillingType = 'monthly' | 'per_day' | 'one_time';

export type MoneyEur = number;

export type CalculatorSelection = {
  packageId: PackageId;
  durationMonths: DurationMonths;

  /**
   * Optional user toggles.
   *
   * - BASIC: photo, video, priority booking, exclusivity are selectable (photo/excl/priority optional; video not available).
   * - PRO: photo included by definition; video/priority/exclusivity selectable.
   * - EXCLUSIVE: photo/priority/exclusivity included by definition; video/extra route days selectable.
   */
  photoReporting?: boolean;
  videoReporting?: boolean;
  priorityBooking?: boolean;
  exclusivity?: boolean;

  /**
   * Extra route days quantity, applied with the same count for each contract month in calculator v1.
   * Contacts benchmark remains unchanged (price only in v1).
   */
  extraRouteDays: number;

  /**
   * UI may choose to display only one mode, but engine should compute both.
   * This is purely a presentation preference for the caller.
   */
  displayMode?: DisplayMode;
};

export type TierGuardrailsStatus = {
  ok: boolean;
  errors: string[];
};

export type AddonEligibility = {
  addonId: AddonId;
  available: boolean;
  includedByDefinition: boolean;
  /**
   * Whether the user has the add-on active (if selectable) or it is included by definition.
   * Included add-ons may still be "active" but with zero additional charge.
   */
  active: boolean;
  /**
   * Charged amounts for the active selection.
   * - monthly recurring add-ons: month1 + fromMonth2 recurring
   * - per-day add-ons: recurring monthly derived from quantity
   * - one-time add-ons: charged once in month1
   */
  chargedMonthlyEur: MoneyEur;
  chargedOneTimeEur: MoneyEur;
};

export type CalculatorLineItem = {
  kind: AddonId | 'base_media' | 'base_discount';
  billing: BillingType;
  /**
   * Where the cost contributes in the totals.
   * - month1: includes recurring add-ons + base discount + one-time fees
   * - recurring: from month2 onward monthly total
   */
  scope: 'month1' | 'recurring' | 'one_time' | 'discount';
  amountEur: MoneyEur;
};

export type CalculatorMonthlyView = {
  month1BaseMediaEur: MoneyEur;
  month1BaseDiscountEur: MoneyEur;
  month1RecurringAddonsEur: MoneyEur;
  month1OneTimeFeesEur: MoneyEur;
  month1TotalEur: MoneyEur;

  fromMonth2BaseMediaEur: MoneyEur;
  fromMonth2RecurringAddonsEur: MoneyEur;
  fromMonth2TotalEur: MoneyEur;

  lineItems: {
    month1: CalculatorLineItem[];
    recurring: CalculatorLineItem[];
    oneTime: CalculatorLineItem[];
  };
};

export type CalculatorContractTotalView = {
  contractTotalEur: MoneyEur;
  month1TotalEur: MoneyEur;
  fromMonth2TotalEur: MoneyEur;
  durationMonths: DurationMonths;
};

export type CalculatorResultOk = {
  ok: true;
  tierGuardrails: TierGuardrailsStatus;
  warnings: string[];

  selection: CalculatorSelection;

  /**
   * UX-facing benchmark — always monthly contacts, unchanged by display mode.
   */
  indicativeMonthlyContacts: number;

  durationMultiplier: number;
  effectiveBaseMonthlyMediaEur: MoneyEur;

  /**
   * Resolved inclusion/eligibility of add-ons for transparency.
   */
  addOnEligibility: AddonEligibility[];

  monthlyView: CalculatorMonthlyView;
  contractTotalView: CalculatorContractTotalView;
};

export type CalculatorResultError = {
  ok: false;
  errors: string[];
  warnings: string[];
  tierGuardrails: TierGuardrailsStatus;
};

export type CalculatorResult = CalculatorResultOk | CalculatorResultError;

