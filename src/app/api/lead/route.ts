import { randomUUID } from 'crypto';

import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

import { mapToLead } from '@/lib/lead/mapper';
import { persistLeadBackup } from '@/lib/lead/persistence';
import { deliverLeadEmails } from '@/lib/lead/provider';
import { checkLeadRateLimit } from '@/lib/lead/rate-limit';
import { getClientIp } from '@/lib/lead/request-ip';
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

function normalizeBody(raw: unknown): { data: Record<string, unknown>; honeypotFilled: boolean } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { data: {}, honeypotFilled: false };
  }
  const o = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const website = str(o.website).trim();
  return {
    honeypotFilled: website.length > 0,
    data: {
      ...o,
      name: str(o.name).trim(),
      company: str(o.company).trim(),
      email: str(o.email).trim(),
      phone: str(o.phone).trim(),
      message: str(o.message).trim(),
      locale: o.locale,
      source: o.source,
      packageId: o.packageId === undefined ? undefined : o.packageId,
      leadOrigin: o.leadOrigin,
      calculatorSummary: o.calculatorSummary,
    },
  };
}

function parseRateLimitEnv(): { max: number; windowMs: number } {
  const maxRaw = process.env.LEAD_RATE_LIMIT_MAX;
  const windowRaw = process.env.LEAD_RATE_LIMIT_WINDOW_MS;
  const max = maxRaw ? Number.parseInt(maxRaw, 10) : 12;
  const windowMs = windowRaw ? Number.parseInt(windowRaw, 10) : 15 * 60 * 1000;
  return {
    max: Number.isFinite(max) && max > 0 ? max : 12,
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : 15 * 60 * 1000,
  };
}

function logLeadLine(
  requestId: string,
  event: string,
  meta: Record<string, string | number | boolean | null | undefined>,
): void {
  console.info(
    JSON.stringify({
      component: 'api/lead',
      requestId,
      event,
      ...meta,
    }),
  );
}

export async function POST(request: Request): Promise<NextResponse<LeadApiResponse>> {
  const requestId = randomUUID();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    logLeadLine(requestId, 'invalid_json', {});
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { data: normalized, honeypotFilled } = normalizeBody(json);

  if (honeypotFilled) {
    logLeadLine(requestId, 'honeypot_triggered', { ip: getClientIp(request) });
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = getClientIp(request);
  const { max, windowMs } = parseRateLimitEnv();
  const rate = checkLeadRateLimit(`lead:${ip}`, max, windowMs);
  if (!rate.allowed) {
    logLeadLine(requestId, 'rate_limited', { ip });
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  const parsed = leadSchema.safeParse(normalized);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      path: i.path.join('.'),
      code: i.code,
    }));
    logLeadLine(requestId, 'validation_failed', {
      issueCount: issues.length,
      issues: JSON.stringify(issues),
    });
    return NextResponse.json(
      { ok: false, error: 'validation_error', fieldErrors: zodToFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const leadOrigin = parsed.data.leadOrigin ?? 'contact';
  const hasCalculatorSummary = parsed.data.calculatorSummary !== undefined;

  const lead = mapToLead(parsed.data);

  const backup = await persistLeadBackup(lead, requestId);
  if (!backup.ok) {
    logLeadLine(requestId, 'backup_failed_non_blocking', {
      code: backup.code,
      locale: lead.locale,
      leadOrigin,
      hasCalculatorSummary,
    });
  } else {
    logLeadLine(requestId, 'backup_persisted', {
      skipped: backup.skipped,
      locale: lead.locale,
      leadOrigin,
      hasCalculatorSummary,
    });
  }

  const emailResult = await deliverLeadEmails(lead).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    logLeadLine(requestId, 'email_failed_non_blocking', {
      error: message.slice(0, 300),
      locale: lead.locale,
      leadOrigin,
      hasCalculatorSummary,
    });
    return null;
  });

  if (emailResult) {
    logLeadLine(requestId, 'lead_processing_complete', {
      backupOk: backup.ok,
      backupSkipped: backup.ok ? backup.skipped : false,
      ownerEmailOk: emailResult.ownerNotificationOk,
      autoReplyOk: emailResult.autoReplyOk,
      locale: lead.locale,
      leadOrigin,
      hasCalculatorSummary,
    });

    if (!emailResult.ownerNotificationOk) {
      logLeadLine(requestId, 'owner_email_failed_after_backup', {
        locale: lead.locale,
        leadOrigin,
        hasCalculatorSummary,
      });
    }
  } else {
    logLeadLine(requestId, 'lead_processing_complete', {
      backupOk: backup.ok,
      backupSkipped: backup.ok ? backup.skipped : false,
      ownerEmailOk: false,
      autoReplyOk: null,
      locale: lead.locale,
      leadOrigin,
      hasCalculatorSummary,
    });
  }

  return NextResponse.json({ ok: true });
}
