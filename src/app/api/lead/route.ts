import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

import { mapToLead } from '@/lib/lead/mapper';
import { sendLead } from '@/lib/lead/provider';
import { leadSchema } from '@/lib/lead/schema';
import type { LeadApiResponse } from '@/lib/lead/types';

function zodToFieldErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && out[key] === undefined) {
      out[key] = issue.message;
    }
  }
  return out;
}

function normalizeBody(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  const o = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
  return {
    ...o,
    name: str(o.name).trim(),
    company: str(o.company).trim(),
    email: str(o.email).trim(),
    phone: str(o.phone).trim(),
    message: str(o.message).trim(),
    locale: o.locale,
    source: o.source,
    packageId: o.packageId === undefined ? undefined : o.packageId,
  };
}

export async function POST(request: Request): Promise<NextResponse<LeadApiResponse>> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const normalized = normalizeBody(json);
  const parsed = leadSchema.safeParse(normalized);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, fieldErrors: zodToFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const lead = mapToLead(parsed.data);
    await sendLead(lead);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/lead] POST failed:', err instanceof Error ? err.message : 'unknown');
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
