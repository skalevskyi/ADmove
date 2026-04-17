/**
 * Phase 2B calculator — rules, validation and eligibility resolution.
 *
 * Pure business rules only; no UI, no side effects.
 */

import {
  ADDON_AVAILABILITY,
  ADDON_PRICES,
  BASE_MONTHLY_MEDIA_EUR,
  DURATION_MULTIPLIERS,
  EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE,
  FIRST_MONTH_BASE_MEDIA_PRICE_FRACTION,
  GUARDRAILS,
  INDICATIVE_MONTHLY_CONTACTS,
  INCLUDED_BY_DEFINITION,
} from './config';
import type {
  AddonEligibility,
  AddonId,
  CalculatorResult,
  CalculatorSelection,
  CalculatorResultError,
  CalculatorResultOk,
  DurationMonths,
  MoneyEur,
  PackageId,
  TierGuardrailsStatus,
} from './types';

const toCents = (eur: number): number => Math.round(eur * 100);
const centsToEur = (cents: number): MoneyEur => cents / 100;

export const DEFAULT_EXTRA_ROUTE_DAYS_MIN = 0;

export function isDurationMonths(value: unknown): value is DurationMonths {
  return value === 3 || value === 6 || value === 9 || value === 12;
}

export function isPackageId(value: unknown): value is PackageId {
  return value === 'BASIC' || value === 'PRO' || value === 'EXCLUSIVE';
}

export type SelectionValidation = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

export function validateSelection(selection: CalculatorSelection): SelectionValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isPackageId(selection.packageId)) {
    errors.push('Invalid packageId');
  }

  if (!isDurationMonths(selection.durationMonths)) {
    errors.push('Invalid durationMonths');
  }

  if (typeof selection.weekendExposure !== 'boolean') {
    errors.push('Invalid weekendExposure (must be a boolean)');
  }

  // BASIC cannot select video_reporting.
  if (selection.packageId === 'BASIC' && selection.videoReporting === true) {
    errors.push('videoReporting is not available for BASIC');
  }

  // EXCLUSIVE should not expose a separate exclusivity toggle.
  // We treat explicit presence of exclusivity in input as an invalid model.
  // This preserves the "no separate exclusivity toggle on EXCLUSIVE" rule for UI integration.
  if (selection.packageId === 'EXCLUSIVE' && Object.prototype.hasOwnProperty.call(selection, 'exclusivity')) {
    errors.push('exclusivity must not be provided for EXCLUSIVE (included by definition)');
  }

  // Basic guardrail: ignore toggles on included-by-definition add-ons but emit warnings.
  if (selection.packageId !== 'BASIC' && selection.photoReporting !== undefined) {
    warnings.push('photoReporting toggle is ignored (included by definition on this package)');
  }

  if (selection.packageId === 'PRO' || selection.packageId === 'EXCLUSIVE') {
    if (selection.priorityBooking === false && selection.packageId === 'EXCLUSIVE') {
      // For EXCLUSIVE it is included; if provided false it's still included.
      warnings.push('priorityBooking toggle is ignored (included by definition on EXCLUSIVE)');
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export type ResolvedSelection = {
  packageId: PackageId;
  durationMonths: DurationMonths;
  weekendExposure: boolean;

  // Resolved add-on active state (included-by-definition are active as true but may have zero charge)
  photoReportingActive: boolean;
  videoReportingActive: boolean;
  exclusivityActive: boolean;
  priorityBookingActive: boolean;
};

export function resolveSelection(selection: CalculatorSelection): ResolvedSelection {
  const included = INCLUDED_BY_DEFINITION[selection.packageId];

  const photoIncluded = included.photo_reporting === true;
  const exclusivityIncluded = included.exclusivity === true;
  const priorityIncluded = included.priority_booking === true;

  const photoActive = photoIncluded ? true : Boolean(selection.photoReporting);
  const exclusivityActive = exclusivityIncluded ? true : Boolean(selection.exclusivity);
  const priorityActive = priorityIncluded ? true : Boolean(selection.priorityBooking);
  const videoActive = Boolean(selection.videoReporting);

  return {
    packageId: selection.packageId,
    durationMonths: selection.durationMonths,
    weekendExposure: selection.weekendExposure,
    photoReportingActive: photoActive,
    videoReportingActive: videoActive,
    exclusivityActive: exclusivityActive,
    priorityBookingActive: priorityActive,
  };
}

function durationMultiplierCents(durationMonths: DurationMonths): number {
  return DURATION_MULTIPLIERS[durationMonths];
}

export function computeEffectiveBaseMonthlyMediaCents(selection: ResolvedSelection): number {
  const baseEur = BASE_MONTHLY_MEDIA_EUR[selection.packageId];
  const mult = durationMultiplierCents(selection.durationMonths);
  return Math.round(toCents(baseEur) * mult);
}

/** Month 1 base media amount (cents): 50% of effective monthly base after duration multiplier. */
export function computeBaseMonth1AfterDiscountCents(effectiveBaseMonthlyCents: number): number {
  return Math.round(effectiveBaseMonthlyCents * FIRST_MONTH_BASE_MEDIA_PRICE_FRACTION);
}

export function computeRecurringAddonsMonthlyCents(resolved: ResolvedSelection): number {
  let total = 0;

  const photoChargeMonthlyEur = resolved.photoReportingActive && resolved.packageId === 'BASIC' ? ADDON_PRICES.photo_reporting.eur : 0;
  const videoChargeMonthlyEur =
    resolved.videoReportingActive && (resolved.packageId === 'PRO' || resolved.packageId === 'EXCLUSIVE') ? ADDON_PRICES.video_reporting.eur : 0;
  const exclusivityChargeMonthlyEur =
    resolved.exclusivityActive && resolved.packageId === 'BASIC'
      ? EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.BASIC
      : resolved.exclusivityActive && resolved.packageId === 'PRO'
        ? EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.PRO
        : 0;

  total += toCents(photoChargeMonthlyEur);
  total += toCents(videoChargeMonthlyEur);
  total += toCents(exclusivityChargeMonthlyEur);

  if (resolved.weekendExposure) {
    total += toCents(ADDON_PRICES.extra_route_day.eur);
  }

  return total;
}

export function computeOneTimeFeesCents(resolved: ResolvedSelection): number {
  // Priority booking is one-time and is only chargeable on BASIC/PRO when activated.
  const priorityChargeEur =
    resolved.priorityBookingActive && (resolved.packageId === 'BASIC' || resolved.packageId === 'PRO')
      ? ADDON_PRICES.priority_booking.eur
      : 0;
  return toCents(priorityChargeEur);
}

export function buildAddOnEligibility(resolved: ResolvedSelection): AddonEligibility[] {
  const included = INCLUDED_BY_DEFINITION[resolved.packageId];

  const photoIncludedByDefinition = included.photo_reporting === true;
  const exclusivityIncludedByDefinition = included.exclusivity === true;
  const priorityIncludedByDefinition = included.priority_booking === true;

  // BASIC: video not available.
  const videoAvailable = ADDON_AVAILABILITY.videoAvailableOn.includes(resolved.packageId);
  const photoAvailable = resolved.packageId === 'BASIC';
  const exclusivityAvailable = ADDON_AVAILABILITY.exclusivitySelectableOn.includes(resolved.packageId);
  const priorityAvailable = resolved.packageId !== 'EXCLUSIVE';

  const photoChargeMonthlyEur = photoIncludedByDefinition ? 0 : resolved.photoReportingActive ? ADDON_PRICES.photo_reporting.eur : 0;
  const videoChargeMonthlyEur = videoAvailable && resolved.videoReportingActive ? ADDON_PRICES.video_reporting.eur : 0;
  const exclusivityChargeMonthlyEur = exclusivityIncludedByDefinition
    ? 0
    : resolved.exclusivityActive && resolved.packageId === 'BASIC'
      ? EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.BASIC
      : resolved.exclusivityActive && resolved.packageId === 'PRO'
        ? EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.PRO
        : 0;

  const extraRouteMonthlyEur = resolved.weekendExposure ? ADDON_PRICES.extra_route_day.eur : 0;

  const priorityChargeOneTimeEur =
    priorityIncludedByDefinition ? 0 : resolved.priorityBookingActive && priorityAvailable ? ADDON_PRICES.priority_booking.eur : 0;

  return [
    {
      addonId: 'photo_reporting',
      available: photoAvailable,
      includedByDefinition: photoIncludedByDefinition,
      active: photoIncludedByDefinition || resolved.photoReportingActive,
      chargedMonthlyEur: photoChargeMonthlyEur,
      chargedOneTimeEur: 0,
    },
    {
      addonId: 'video_reporting',
      available: videoAvailable,
      includedByDefinition: false,
      active: videoAvailable && resolved.videoReportingActive,
      chargedMonthlyEur: videoChargeMonthlyEur,
      chargedOneTimeEur: 0,
    },
    {
      addonId: 'extra_route_day',
      available: true,
      includedByDefinition: false,
      active: resolved.weekendExposure,
      chargedMonthlyEur: extraRouteMonthlyEur,
      chargedOneTimeEur: 0,
    },
    {
      addonId: 'priority_booking',
      available: priorityAvailable,
      includedByDefinition: priorityIncludedByDefinition,
      active: priorityIncludedByDefinition || resolved.priorityBookingActive,
      chargedMonthlyEur: 0,
      chargedOneTimeEur: priorityChargeOneTimeEur,
    },
    {
      addonId: 'exclusivity',
      available: exclusivityAvailable,
      includedByDefinition: exclusivityIncludedByDefinition,
      active: exclusivityIncludedByDefinition || resolved.exclusivityActive,
      chargedMonthlyEur: exclusivityChargeMonthlyEur,
      chargedOneTimeEur: 0,
    },
  ];
}

export function computeIndicativeMonthlyContacts(packageId: PackageId): number {
  return INDICATIVE_MONTHLY_CONTACTS[packageId];
}

export function computeTierGuardrailsStatus(): TierGuardrailsStatus {
  const errors: string[] = [];

  for (const durationMonths of [3, 6, 9, 12] as DurationMonths[]) {
    const mult = DURATION_MULTIPLIERS[durationMonths];

    // BASIC upper stack uses base + photo + exclusivity (recurring monthly add-ons only).
    const basicBase = toCents(BASE_MONTHLY_MEDIA_EUR.BASIC) * mult;
    const basicUpperRecurring =
      basicBase + toCents(ADDON_PRICES.photo_reporting.eur) + toCents(EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.BASIC);
    const proBase = toCents(BASE_MONTHLY_MEDIA_EUR.PRO) * mult;

    if (!(basicUpperRecurring < proBase)) {
      errors.push(`Guardrail failed for duration=${durationMonths}: BASIC recurring stack must be < PRO base`);
    }

    // PRO upper stack uses base + video + exclusivity (photo is included and 0-charge; extra route day excluded).
    const proUpperRecurring =
      toCents(BASE_MONTHLY_MEDIA_EUR.PRO) * mult +
      toCents(ADDON_PRICES.video_reporting.eur) +
      toCents(EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE.PRO);
    const exclusiveBase = toCents(BASE_MONTHLY_MEDIA_EUR.EXCLUSIVE) * mult;

    if (!(proUpperRecurring < exclusiveBase)) {
      errors.push(`Guardrail failed for duration=${durationMonths}: PRO recurring stack must be < EXCLUSIVE base`);
    }
  }

  return { ok: errors.length === 0, errors };
}

