/**
 * Phase 2B calculator — source-of-truth constants/config.
 * Business constants only (no runtime business logic).
 */

import type { AddonId, DisplayMode, DurationMonths, PackageId } from './types';

export const PACKAGE_IDS = ['BASIC', 'PRO', 'EXCLUSIVE'] as const satisfies PackageId[];

export const DURATION_OPTIONS = [3, 6, 9, 12] as const satisfies DurationMonths[];

export const DISPLAY_MODES = ['monthly', 'contract_total'] as const satisfies DisplayMode[];

// ===== Base media fees (ex-tax / HT as per calculator spec) =====
export const BASE_MONTHLY_MEDIA_EUR: Record<PackageId, number> = {
  BASIC: 300,
  PRO: 490,
  EXCLUSIVE: 690,
};

// ===== Duration multipliers (applied to base media fee only) =====
export const DURATION_MULTIPLIERS: Record<DurationMonths, number> = {
  3: 1.0,
  6: 0.95,
  9: 0.92,
  12: 0.88,
};

// ===== First month: base media is charged at this fraction of effective monthly base (after duration multiplier) =====
export const FIRST_MONTH_BASE_MEDIA_PRICE_FRACTION = 0.5;

// ===== Add-ons: draft prices =====
/** Monthly € when exclusivity is selected (BASIC / PRO). EXCLUSIVE: included by definition, no line item. */
export const EXCLUSIVITY_MONTHLY_EUR_BY_PACKAGE: Record<'BASIC' | 'PRO', number> = {
  BASIC: 120,
  PRO: 100,
};

type StandardAddonPrice = { eur: number; billing: 'monthly' | 'per_day' | 'one_time' };

export const ADDON_PRICES: Record<Exclude<AddonId, 'exclusivity'>, StandardAddonPrice> & {
  exclusivity: { billing: 'monthly' };
} = {
  photo_reporting: { eur: 20, billing: 'monthly' },
  video_reporting: { eur: 40, billing: 'monthly' },
  extra_route_day: { eur: 30, billing: 'monthly' },
  priority_booking: { eur: 30, billing: 'one_time' },
  exclusivity: { billing: 'monthly' },
};

// ===== Monthly indicative contacts benchmark (UX-facing, fixed) =====
export const INDICATIVE_MONTHLY_CONTACTS: Record<PackageId, number> = {
  BASIC: 30000,
  PRO: 45000,
  EXCLUSIVE: 60000,
};

export const ADDON_AVAILABILITY = {
  // BASIC:
  videoAvailableOn: ['PRO', 'EXCLUSIVE'] as PackageId[],
  exclusivitySelectableOn: ['BASIC', 'PRO'] as PackageId[],
} as const;

// ===== Inclusion matrix (definition) =====
// includedByDefinition:
// - photo_reporting included on PRO + EXCLUSIVE (no extra charge line)
// - priority_booking included on EXCLUSIVE (no separate charge line)
// - exclusivity included on EXCLUSIVE (no separate toggle/charge line)
export const INCLUDED_BY_DEFINITION: Record<PackageId, Partial<Record<AddonId, boolean>>> = {
  BASIC: {},
  PRO: {
    photo_reporting: true,
  },
  EXCLUSIVE: {
    photo_reporting: true,
    priority_booking: true,
    exclusivity: true,
  },
};

// ===== Guardrails: tier hierarchy protection =====
// These checks exclude extra_route_day and one_time fees from tier-substitution intent.
export const GUARDRAILS = {
  // BASIC loadout uses photo_reporting + exclusivity (recurring monthly add-ons only).
  basicUpperAdds: ['photo_reporting', 'exclusivity'] as AddonId[],
  // PRO loadout uses video_reporting + exclusivity (recurring monthly add-ons only).
  proUpperAdds: ['video_reporting', 'exclusivity'] as AddonId[],
} as const;

