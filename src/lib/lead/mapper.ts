import type { LeadSchemaInput } from './schema';
import type { Lead } from './types';

function trimOrUndefined(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const t = value.trim();
  return t === '' ? undefined : t;
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

  return {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    locale: input.locale,
    source: 'contact',
    company,
    phone,
    packageId,
    createdAt: new Date().toISOString(),
  };
}
