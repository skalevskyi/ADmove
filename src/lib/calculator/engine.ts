/**
 * Phase 2B calculator — pure compute engine.
 *
 * Business rules only; no JSX, no routing, no API calls.
 */

import {
  computeEffectiveBaseMonthlyMediaCents,
  computeIndicativeMonthlyContacts,
  computeOneTimeFeesCents,
  computeRecurringAddonsMonthlyCents,
  computeBaseMonth1AfterDiscountCents,
  buildAddOnEligibility,
  computeTierGuardrailsStatus,
  resolveSelection,
  validateSelection,
} from './rules';
import { DURATION_MULTIPLIERS } from './config';
import type {
  CalculatorResult,
  CalculatorResultError,
  CalculatorResultOk,
  CalculatorSelection,
  CalculatorContractTotalView,
  CalculatorMonthlyView,
  MoneyEur,
  TierGuardrailsStatus,
} from './types';

const centsToEur = (cents: number): MoneyEur => cents / 100;

export function calculateCalculator(selection: CalculatorSelection): CalculatorResult {
  const tierGuardrails = computeTierGuardrailsStatus();
  const baseValidation = validateSelection(selection);

  if (!baseValidation.ok) {
    const err: CalculatorResultError = {
      ok: false,
      errors: baseValidation.errors,
      warnings: [...baseValidation.warnings],
      tierGuardrails,
    };
    return err;
  }

  // Guardrails are product config protections.
  // In approved draft numbers they must pass; if they don't, return structured error.
  if (!tierGuardrails.ok) {
    const err: CalculatorResultError = {
      ok: false,
      errors: tierGuardrails.errors,
      warnings: [...baseValidation.warnings],
      tierGuardrails,
    };
    return err;
  }

  const resolved = resolveSelection(selection);

  const effectiveBaseMonthlyCents = computeEffectiveBaseMonthlyMediaCents(resolved);
  const month1BaseAfterDiscountCents =
    computeBaseMonth1AfterDiscountCents(effectiveBaseMonthlyCents);

  const recurringAddonsMonthlyCents = computeRecurringAddonsMonthlyCents(resolved);
  const oneTimeFeesCents = computeOneTimeFeesCents(resolved);

  const month1TotalCents = month1BaseAfterDiscountCents + recurringAddonsMonthlyCents + oneTimeFeesCents;
  const fromMonth2TotalCents = effectiveBaseMonthlyCents + recurringAddonsMonthlyCents;

  const contractTotalCents =
    month1TotalCents + (resolved.durationMonths - 1) * fromMonth2TotalCents;

  const indicativeMonthlyContacts = computeIndicativeMonthlyContacts(resolved.packageId);

  const addOnEligibility = buildAddOnEligibility(resolved);

  const warnings: string[] = [...baseValidation.warnings];

  const month1BaseMediaEur = centsToEur(month1BaseAfterDiscountCents);
  const month1BaseDiscountEur = centsToEur(effectiveBaseMonthlyCents - month1BaseAfterDiscountCents);
  const month1RecurringAddonsEur = centsToEur(recurringAddonsMonthlyCents);
  const month1OneTimeFeesEur = centsToEur(oneTimeFeesCents);
  const month1TotalEur = centsToEur(month1TotalCents);

  const fromMonth2BaseMediaEur = centsToEur(effectiveBaseMonthlyCents);
  const fromMonth2RecurringAddonsEur = centsToEur(recurringAddonsMonthlyCents);
  const fromMonth2TotalEur = centsToEur(fromMonth2TotalCents);

  const monthlyView: CalculatorMonthlyView = {
    month1BaseMediaEur,
    month1BaseDiscountEur,
    month1RecurringAddonsEur,
    month1OneTimeFeesEur,
    month1TotalEur,

    fromMonth2BaseMediaEur,
    fromMonth2RecurringAddonsEur,
    fromMonth2TotalEur,
    lineItems: {
      month1: [
        {
          kind: 'base_media',
          billing: 'monthly',
          scope: 'month1',
          amountEur: month1BaseMediaEur,
        },
        {
          kind: 'base_discount',
          billing: 'monthly',
          scope: 'discount',
          amountEur: month1BaseDiscountEur,
        },
        ...addOnEligibility
          .filter((a) => a.chargedMonthlyEur > 0)
          .map((a) => ({
            kind: a.addonId,
            billing: a.chargedOneTimeEur > 0 ? ('one_time' as const) : ('monthly' as const),
            scope: 'month1' as const,
            amountEur: a.chargedMonthlyEur,
          })),
      ],
      recurring: [
        {
          kind: 'base_media',
          billing: 'monthly',
          scope: 'recurring',
          amountEur: fromMonth2BaseMediaEur,
        },
        ...addOnEligibility
          .filter((a) => a.chargedMonthlyEur > 0)
          .map((a) => ({
            kind: a.addonId,
            billing: 'monthly' as const,
            scope: 'recurring' as const,
            amountEur: a.chargedMonthlyEur,
          })),
      ],
      oneTime: addOnEligibility
        .filter((a) => a.chargedOneTimeEur > 0)
        .map((a) => ({
          kind: a.addonId,
          billing: 'one_time' as const,
          scope: 'one_time' as const,
          amountEur: a.chargedOneTimeEur,
        })),
    },
  };

  const contractTotalView: CalculatorContractTotalView = {
    contractTotalEur: centsToEur(contractTotalCents),
    month1TotalEur,
    fromMonth2TotalEur,
    durationMonths: resolved.durationMonths,
  };

  const ok: CalculatorResultOk = {
    ok: true,
    tierGuardrails,
    warnings,
    selection,
    indicativeMonthlyContacts,
    durationMultiplier: DURATION_MULTIPLIERS[selection.durationMonths],
    effectiveBaseMonthlyMediaEur: centsToEur(effectiveBaseMonthlyCents),
    addOnEligibility,
    monthlyView,
    contractTotalView,
  };

  return ok;
}

