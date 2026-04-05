import type { LeadSchemaInput } from './schema';
import type { CalculatorSummary, Lead, LeadOrigin } from './types';

function trimOrUndefined(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const t = value.trim();
  return t === '' ? undefined : t;
}

function normalizeCalculatorSummary(raw: CalculatorSummary | undefined): CalculatorSummary | undefined {
  if (!raw) return undefined;
  return {
    packageLabel: String(raw.packageLabel).trim().slice(0, 500),
    paymentMode: String(raw.paymentMode).trim().slice(0, 200),
    durationMonths: raw.durationMonths,
    addons: raw.addons.map((a) => String(a).trim().slice(0, 300)).filter((a) => a.length > 0),
    totalPrice: raw.totalPrice,
  };
}

/**
 * Maps validated client input to a normalized lead with server timestamp.
 */
export function mapToLead(input: LeadSchemaInput): Lead {
  const company = trimOrUndefined(input.company);
  const phone = trimOrUndefined(input.phone);
  const packageId =
    input.packageId === undefined || input.packageId === null || String(input.packageId).trim() === ''
      ? null
      : String(input.packageId).trim();

  const leadOrigin: LeadOrigin = input.leadOrigin ?? 'contact';
  const calculatorSummary =
    input.calculatorSummary !== undefined ? normalizeCalculatorSummary(input.calculatorSummary) : undefined;

  return {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    locale: input.locale,
    source: 'contact',
    company,
    phone,
    packageId,
    leadOrigin,
    calculatorSummary,
    createdAt: new Date().toISOString(),
  };
}
