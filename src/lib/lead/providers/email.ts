import { Resend } from 'resend';

import type { Lead } from '../types';

const MISSING_KEY = 'resend_not_configured';
const MISSING_LEAD_TO = 'lead_to_email_not_configured';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Sends lead details via Resend (server-only).
 *
 * Required env: `RESEND_API_KEY`, `LEAD_TO_EMAIL` (no runtime fallback — configure in Vercel for production).
 *
 * `RESEND_FROM_EMAIL`: optional. Defaults to Resend’s onboarding sender for local/tests only.
 * Production must use a verified domain/sender in the Resend dashboard.
 */
export async function sendLeadEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(MISSING_KEY);
  }

  const to = process.env.LEAD_TO_EMAIL?.trim();
  if (!to) {
    throw new Error(MISSING_LEAD_TO);
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? 'SPM Lead <onboarding@resend.dev>';

  const resend = new Resend(apiKey);

  const lines = [
    ['Name', lead.name],
    ['Company', lead.company ?? '—'],
    ['Email', lead.email],
    ['Phone', lead.phone ?? '—'],
    ['Locale', lead.locale],
    ['Source', lead.source],
    ['Package', lead.packageId ?? '—'],
    ['Created', lead.createdAt],
    ['Message', lead.message],
  ];

  const html = `
    <h1>New lead — SPM</h1>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      ${lines
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">${escapeHtml(String(k))}</td><td style="padding:6px 0;border-bottom:1px solid #e2e8f0;">${escapeHtml(String(v))}</td></tr>`,
        )
        .join('')}
    </table>
  `;

  const text = lines.map(([k, v]) => `${k}: ${v}`).join('\n');

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `[SPM Lead] ${lead.name} — ${lead.email}`,
    html,
    text,
  });

  if (error) {
    throw new Error('resend_send_failed');
  }
}
