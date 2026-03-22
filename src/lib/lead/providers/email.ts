import { Resend } from 'resend';

import type { Lead, LeadLocale } from '../types';

const MISSING_KEY = 'resend_not_configured';
const MISSING_LEAD_TO = 'lead_to_email_not_configured';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Basic check — skip auto-reply when obviously invalid. */
function isValidEmailForAutoReply(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function getAutoReplyCopy(
  locale: LeadLocale,
  safeName: string,
  plainName: string,
): { subject: string; html: string; text: string } {
  const footer = 'SPM — Skalevskyi publicité mobile';
  const footerHtml = escapeHtml(footer);

  switch (locale) {
    case 'fr':
      return {
        subject: 'Votre demande a bien été reçue — SPM',
        html: `
    <p>Bonjour ${safeName},</p>
    <p>Merci pour votre demande.</p>
    <p>Nous avons bien reçu votre message et reviendrons vers vous sous 24 heures avec une proposition adaptée.</p>
    <p>Sans engagement.</p>
    <p>Cordialement,<br>${footerHtml}</p>
  `,
        text: [
          `Bonjour ${plainName},`,
          '',
          'Merci pour votre demande.',
          '',
          'Nous avons bien reçu votre message et reviendrons vers vous sous 24 heures avec une proposition adaptée.',
          '',
          'Sans engagement.',
          '',
          'Cordialement,',
          footer,
        ].join('\n'),
      };
    case 'en':
      return {
        subject: 'We received your request — SPM',
        html: `
    <p>Hello ${safeName},</p>
    <p>Thank you for your message.</p>
    <p>We have received your request and will get back to you within 24 hours with a tailored proposal.</p>
    <p>No commitment required.</p>
    <p>Best regards,<br>${footerHtml}</p>
  `,
        text: [
          `Hello ${plainName},`,
          '',
          'Thank you for your message.',
          '',
          'We have received your request and will get back to you within 24 hours with a tailored proposal.',
          '',
          'No commitment required.',
          '',
          'Best regards,',
          footer,
        ].join('\n'),
      };
    case 'ua':
      return {
        subject: 'Ми отримали ваш запит — SPM',
        html: `
    <p>Вітаємо, ${safeName},</p>
    <p>Дякуємо за ваше звернення.</p>
    <p>Ми отримали ваш запит і зв'яжемося з вами протягом 24 годин із відповідною пропозицією.</p>
    <p>Без зобов'язань.</p>
    <p>З повагою,<br>${footerHtml}</p>
  `,
        text: [
          `Вітаємо, ${plainName},`,
          '',
          'Дякуємо за ваше звернення.',
          '',
          "Ми отримали ваш запит і зв'яжемося з вами протягом 24 годин із відповідною пропозицією.",
          '',
          "Без зобов'язань.",
          '',
          'З повагою,',
          footer,
        ].join('\n'),
      };
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

/**
 * Sends lead details to the owner via Resend (server-only).
 *
 * Required env: `RESEND_API_KEY`, `LEAD_TO_EMAIL` (no runtime fallback — configure in Vercel for production).
 *
 * `RESEND_FROM_EMAIL`: optional. Defaults to Resend’s onboarding sender for local/tests only.
 * Production must use a verified domain/sender in the Resend dashboard.
 */
export async function sendLeadNotification(lead: Lead): Promise<void> {
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

/**
 * Sends a localized confirmation to the lead’s email. Skips when email is empty or fails basic validation.
 * Uses `RESEND_FROM_EMAIL` like owner notifications.
 */
export async function sendLeadAutoReply(lead: Lead): Promise<void> {
  const email = lead.email.trim();
  if (!email || !isValidEmailForAutoReply(email)) {
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(MISSING_KEY);
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? 'SPM Lead <onboarding@resend.dev>';

  const resend = new Resend(apiKey);
  const rawName = lead.name.trim() || '—';
  const safeName = escapeHtml(rawName);
  const { subject, html, text } = getAutoReplyCopy(lead.locale, safeName, rawName);

  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject,
    html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.5;color:#0f172a;">${html}</div>`,
    text,
  });

  if (error) {
    throw new Error('resend_send_failed');
  }
}
