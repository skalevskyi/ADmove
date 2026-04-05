import { Resend } from 'resend';

import type { CalculatorSummary, Lead, LeadLocale } from '../types';

const MISSING_KEY = 'resend_not_configured';
const MISSING_LEAD_TO = 'lead_to_email_not_configured';

const BRAND_LINE = 'SPM — Skalevskyi publicité mobile';
const SITE_URL = 'https://www.spmads.fr';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Safe display name for greetings — rejects junk / injection-like input. */
function getSafeGreetingName(name: string): string | null {
  const t = name.trim();
  if (t.length < 2) return null;
  const lower = t.toLowerCase();
  if (lower.includes('bonjour') || lower.includes('test') || lower.includes('lead') || lower.includes('calculator')) {
    return null;
  }
  return t;
}

function displayOrEmDash(value: string | undefined | null): string {
  const t = value?.trim() ?? '';
  return t === '' ? '—' : t;
}

/** Basic check — skip auto-reply when obviously invalid. */
function isValidEmailForAutoReply(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/** Masks local part for logs — keeps domain visible for debugging. */
function maskEmailForLog(email: string): string {
  const t = email.trim();
  if (!t) {
    return '(empty)';
  }
  const at = t.indexOf('@');
  if (at <= 0) {
    return '(invalid)';
  }
  const local = t.slice(0, at);
  const domain = t.slice(at + 1);
  const localMasked =
    local.length <= 1 ? `${local}***` : `${local[0]}***${local.slice(-1)}`;
  return `${localMasked}@${domain}`;
}

/** Safe Resend error summary — no full payload. */
function formatResendErrorForAutoReply(error: unknown): string {
  if (error == null) {
    return 'unknown';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object') {
    const o = error as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof o.name === 'string') {
      parts.push(`name=${o.name}`);
    }
    if (typeof o.message === 'string') {
      parts.push(`message=${o.message}`);
    }
    if (typeof o.statusCode === 'number') {
      parts.push(`statusCode=${String(o.statusCode)}`);
    }
    const code = o.code;
    if (typeof code === 'string' || typeof code === 'number') {
      parts.push(`code=${String(code)}`);
    }
    return parts.length > 0 ? parts.join(' | ') : 'unrecognized_error';
  }
  return String(error);
}

type AutoReplyLocaleCopy = {
  subject: string;
  headerTitle: string;
  introHtml: string;
  yourMessageLabel: string;
  nextStepsTitle: string;
  nextStepsBody: string;
  closingLine: string;
};

function getAutoReplyLocaleCopy(locale: LeadLocale): AutoReplyLocaleCopy {
  switch (locale) {
    case 'fr':
      return {
        subject: 'Votre demande a bien été reçue — SPM',
        headerTitle: 'Votre demande a bien été reçue',
        introHtml: `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">Merci pour votre demande. Nous avons bien reçu votre message.</p>`,
        yourMessageLabel: 'Votre message',
        nextStepsTitle: 'Prochaines étapes',
        nextStepsBody:
          'Nous examinons votre demande et reviendrons vers vous sous 24 heures avec une proposition adaptée. Sans engagement.',
        closingLine: 'Cordialement,',
      };
    case 'en':
      return {
        subject: 'We received your request — SPM',
        headerTitle: 'We received your request',
        introHtml: `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">Thank you for your message. We have received your request.</p>`,
        yourMessageLabel: 'Your message',
        nextStepsTitle: 'What happens next',
        nextStepsBody:
          'We will review your request and get back to you within 24 hours with a tailored proposal. No commitment required.',
        closingLine: 'Best regards,',
      };
    case 'ua':
      return {
        subject: 'Ми отримали ваш запит — SPM',
        headerTitle: 'Ми отримали ваш запит',
        introHtml: `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">Дякуємо за ваше звернення. Ми отримали ваш запит.</p>`,
        yourMessageLabel: 'Ваше повідомлення',
        nextStepsTitle: 'Наступні кроки',
        nextStepsBody:
          "Ми розглянемо ваш запит і зв'яжемося з вами протягом 24 годин із відповідною пропозицією. Без зобов'язань.",
        closingLine: 'З повагою,',
      };
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

function buildAutoReplyGreetingHtml(locale: LeadLocale, rawName: string): string {
  const safe = getSafeGreetingName(rawName);
  const escaped = safe ? escapeHtml(safe) : null;
  switch (locale) {
    case 'fr':
      return escaped
        ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Bonjour ${escaped},</p>`
        : `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Bonjour,</p>`;
    case 'en':
      return escaped
        ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Hello ${escaped},</p>`
        : `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Hello,</p>`;
    case 'ua':
      return escaped
        ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Вітаємо, ${escaped},</p>`
        : `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Вітаємо,</p>`;
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

function buildAutoReplyGreetingPlainLine(locale: LeadLocale, rawName: string): string {
  const safe = getSafeGreetingName(rawName);
  switch (locale) {
    case 'fr':
      return safe ? `Bonjour ${safe},` : 'Bonjour,';
    case 'en':
      return safe ? `Hello ${safe},` : 'Hello,';
    case 'ua':
      return safe ? `Вітаємо, ${safe},` : 'Вітаємо,';
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

type CalculatorAutoReplyLabels = {
  sectionTitle: string;
  offer: string;
  paymentMode: string;
  duration: string;
  options: string;
  totalPrice: string;
  monthUnit: string;
};

function getCalculatorAutoReplyLabels(locale: LeadLocale): CalculatorAutoReplyLabels {
  switch (locale) {
    case 'fr':
      return {
        sectionTitle: 'Votre configuration',
        offer: 'Offre :',
        paymentMode: 'Mode de paiement :',
        duration: 'Durée :',
        options: 'Options :',
        totalPrice: 'Prix total :',
        monthUnit: 'mois',
      };
    case 'en':
      return {
        sectionTitle: 'Your configuration',
        offer: 'Offer:',
        paymentMode: 'Payment mode:',
        duration: 'Duration:',
        options: 'Options:',
        totalPrice: 'Total price:',
        monthUnit: 'months',
      };
    case 'ua':
      return {
        sectionTitle: 'Ваша конфігурація',
        offer: 'Пропозиція:',
        paymentMode: 'Режим оплати:',
        duration: 'Тривалість:',
        options: 'Опції:',
        totalPrice: 'Загальна ціна:',
        monthUnit: 'міс.',
      };
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}

function formatEuroPlain(n: number): string {
  return `€${Math.round(n)}`;
}

function buildCalculatorSummaryBoxHtmlAutoReply(summary: CalculatorSummary, locale: LeadLocale): string {
  const labels = getCalculatorAutoReplyLabels(locale);
  const pkg = escapeHtml(summary.packageLabel.slice(0, 500));
  const mode = escapeHtml(summary.paymentMode.slice(0, 200));
  const months = summary.durationMonths;
  const durLine = `${escapeHtml(String(months))} ${escapeHtml(labels.monthUnit)}`;
  const addonsLines =
    summary.addons.length === 0
      ? `<p style="margin:4px 0 0;font-size:14px;line-height:1.5;color:#64748b;">${escapeHtml('—')}</p>`
      : summary.addons
          .map((a) => escapeHtml(a.slice(0, 500)))
          .map(
            (line) =>
              `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#334155;">${line}</p>`,
          )
          .join('');
  const priceEscaped = escapeHtml(formatEuroPlain(summary.totalPrice));

  return `
<p style="margin:20px 0 10px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">${escapeHtml(labels.sectionTitle)}</p>
<div style="border:1px solid #e2e8f0;border-radius:8px;padding:16px;background:#f1f5f9;">
  <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml(labels.offer)}</span> ${pkg}</p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml(labels.paymentMode)}</span> ${mode}</p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml(labels.duration)}</span> ${durLine}</p>
  <p style="margin:0 0 6px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#64748b;">${escapeHtml(labels.options)}</p>
  <div style="margin:0 0 10px;">${addonsLines}</div>
  <p style="margin:0;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml(labels.totalPrice)}</span> ${priceEscaped}</p>
</div>`.trim();
}

function buildCalculatorSummarySectionHtmlOwner(summary: CalculatorSummary): string {
  const pkg = escapeHtml(summary.packageLabel.slice(0, 500));
  const mode = escapeHtml(summary.paymentMode.slice(0, 200));
  const months = summary.durationMonths;
  const durLine = escapeHtml(`${months} months`);
  const addonsLines =
    summary.addons.length === 0
      ? `<p style="margin:4px 0 0;font-size:14px;line-height:1.5;color:#64748b;">${escapeHtml('—')}</p>`
      : summary.addons
          .map((a) => escapeHtml(a.slice(0, 500)))
          .map(
            (line) =>
              `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#334155;">${line}</p>`,
          )
          .join('');
  const priceEscaped = escapeHtml(formatEuroPlain(summary.totalPrice));

  return `
<p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">Calculator Summary</p>
<div style="border:1px solid #e2e8f0;border-radius:8px;padding:16px;background:#f1f5f9;margin-bottom:4px;">
  <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml('Offer:')}</span> ${pkg}</p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml('Payment mode:')}</span> ${mode}</p>
  <p style="margin:0 0 8px;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml('Duration:')}</span> ${durLine}</p>
  <p style="margin:0 0 6px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:#64748b;">${escapeHtml('Options:')}</p>
  <div style="margin:0 0 10px;">${addonsLines}</div>
  <p style="margin:0;font-size:14px;line-height:1.55;color:#334155;"><span style="color:#64748b;font-weight:600;">${escapeHtml('Total price:')}</span> ${priceEscaped}</p>
</div>`.trim();
}

function buildCalculatorSummaryPlainAutoReply(summary: CalculatorSummary, locale: LeadLocale): string {
  const labels = getCalculatorAutoReplyLabels(locale);
  const lines: string[] = [
    '---',
    'CONFIGURATION:',
    '',
    `${labels.offer} ${summary.packageLabel}`,
    `${labels.paymentMode} ${summary.paymentMode}`,
    `${labels.duration} ${String(summary.durationMonths)} ${labels.monthUnit}`,
    `${labels.options}`,
  ];
  if (summary.addons.length === 0) {
    lines.push('—');
  } else {
    for (const a of summary.addons) {
      lines.push(`- ${a}`);
    }
  }
  lines.push(`${labels.totalPrice} ${formatEuroPlain(summary.totalPrice)}`);
  lines.push('---');
  return lines.join('\n');
}

function buildCalculatorSummaryPlainOwner(summary: CalculatorSummary): string {
  const lines: string[] = [
    '---',
    'CONFIGURATION:',
    '',
    `Offer: ${summary.packageLabel}`,
    `Mode: ${summary.paymentMode}`,
    `Duration: ${summary.durationMonths} months`,
    'Options:',
  ];
  if (summary.addons.length === 0) {
    lines.push('—');
  } else {
    for (const a of summary.addons) {
      lines.push(`- ${a}`);
    }
  }
  lines.push(`Price: ${formatEuroPlain(summary.totalPrice)}`);
  lines.push('---');
  return lines.join('\n');
}

function buildAutoReplyHtml(lead: Lead): { html: string; text: string; subject: string } {
  const copy = getAutoReplyLocaleCopy(lead.locale);
  const greetingHtml = buildAutoReplyGreetingHtml(lead.locale, lead.name);
  const msgTrim = lead.message.trim();
  const showMessage = msgTrim.length > 0;
  const safeMessage = escapeHtml(msgTrim);

  const calculatorBlockHtml =
    lead.leadOrigin === 'calculator' && lead.calculatorSummary
      ? buildCalculatorSummaryBoxHtmlAutoReply(lead.calculatorSummary, lead.locale)
      : '';

  const messageBlockHtml = showMessage
    ? `
      <p style="margin:20px 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">${escapeHtml(copy.yourMessageLabel)}</p>
      <div style="border:1px solid #e2e8f0;border-radius:6px;padding:14px;background:#fafafa;font-size:14px;line-height:1.55;color:#334155;white-space:pre-wrap;">${safeMessage}</div>`
    : '';

  const brandEscaped = escapeHtml(BRAND_LINE);

  const innerHtml = `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f8fafc;padding:24px 12px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:28px 28px 20px;border-bottom:1px solid #f1f5f9;">
            <p style="margin:0 0 6px;font-size:20px;font-weight:600;color:#0f172a;line-height:1.3;">${escapeHtml(copy.headerTitle)}</p>
            <p style="margin:0;font-size:13px;color:#64748b;">${brandEscaped}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:22px 28px 8px;">
            ${greetingHtml}
            ${copy.introHtml}
            ${calculatorBlockHtml}
            ${messageBlockHtml}
            <p style="margin:22px 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">${escapeHtml(copy.nextStepsTitle)}</p>
            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(copy.nextStepsBody)}</p>
            <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(copy.closingLine)}</p>
            <p style="margin:0;font-size:14px;line-height:1.5;color:#0f172a;">${brandEscaped}</p>
            <p style="margin:12px 0 0;font-size:14px;">
              <a href="${SITE_URL}" style="color:#0284c7;text-decoration:none;">www.spmads.fr</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();

  const textBody = buildAutoReplyPlainText(lead, copy, msgTrim, showMessage);
  return { subject: copy.subject, html: innerHtml, text: textBody };
}

function buildAutoReplyPlainText(
  lead: Lead,
  copy: AutoReplyLocaleCopy,
  msgTrim: string,
  showMessage: boolean,
): string {
  const greetingLine = buildAutoReplyGreetingPlainLine(lead.locale, lead.name);

  const intro =
    lead.locale === 'fr'
      ? 'Merci pour votre demande. Nous avons bien reçu votre message.'
      : lead.locale === 'en'
        ? 'Thank you for your message. We have received your request.'
        : 'Дякуємо за ваше звернення. Ми отримали ваш запит.';

  const out: string[] = [copy.headerTitle, BRAND_LINE, '', greetingLine, '', intro];

  if (lead.leadOrigin === 'calculator' && lead.calculatorSummary) {
    out.push('', buildCalculatorSummaryPlainAutoReply(lead.calculatorSummary, lead.locale), '');
  }

  if (showMessage) {
    out.push('', copy.yourMessageLabel, '-'.repeat(28), msgTrim);
  }

  out.push(
    '',
    copy.nextStepsTitle,
    copy.nextStepsBody,
    '',
    copy.closingLine,
    BRAND_LINE,
    SITE_URL,
  );

  return out.join('\n');
}

function buildOwnerNotificationBodies(lead: Lead): { html: string; text: string } {
  const brandEscaped = escapeHtml(BRAND_LINE);
  const nameDisp = escapeHtml(lead.name);
  const companyDisp = escapeHtml(displayOrEmDash(lead.company));
  const emailRaw = lead.email.trim();
  const emailEscaped = escapeHtml(emailRaw);
  const mailtoHref = `mailto:${encodeURIComponent(emailRaw)}`;
  const phoneDisp = escapeHtml(displayOrEmDash(lead.phone));
  const localeDisp = escapeHtml(lead.locale);
  const sourceDisp = escapeHtml(lead.source);
  const packageDisp = escapeHtml(lead.packageId ?? '—');
  const createdDisp = escapeHtml(lead.createdAt);
  const messageEscaped = escapeHtml(lead.message);

  const calculatorSectionHtml = lead.calculatorSummary
    ? buildCalculatorSummarySectionHtmlOwner(lead.calculatorSummary)
    : '';

  const row = (label: string, valueHtml: string) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#64748b;width:38%;vertical-align:top;font-size:13px;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;vertical-align:top;">${valueHtml}</td>
    </tr>`;

  const html = `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f8fafc;padding:24px 12px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        <tr>
          <td style="padding:24px 28px 18px;border-bottom:1px solid #f1f5f9;">
            <p style="margin:0 0 6px;font-size:20px;font-weight:600;color:#0f172a;line-height:1.3;">New lead</p>
            <p style="margin:0;font-size:13px;color:#64748b;line-height:1.4;">${brandEscaped}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px 8px;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">Summary</p>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
              ${row('Name', nameDisp)}
              ${row('Company', companyDisp)}
              ${row('Email', `<a href="${mailtoHref}" style="color:#0284c7;text-decoration:none;">${emailEscaped}</a>`)}
              ${row('Phone', phoneDisp)}
              ${row('Locale', localeDisp)}
              ${row('Source', sourceDisp)}
              ${row('Package', packageDisp)}
              ${row('Created at', createdDisp)}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 28px 28px;">
            ${calculatorSectionHtml}
            <p style="margin:0 0 10px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;">Message</p>
            <div style="border:1px solid #e2e8f0;border-radius:6px;padding:14px;background:#fafafa;font-size:14px;line-height:1.55;color:#334155;white-space:pre-wrap;">${messageEscaped}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();

  const textParts: string[] = [
    'New lead',
    BRAND_LINE,
    '',
    'Summary',
    `Name: ${lead.name}`,
    `Company: ${displayOrEmDash(lead.company)}`,
    `Email: ${emailRaw}`,
    `Phone: ${displayOrEmDash(lead.phone)}`,
    `Locale: ${lead.locale}`,
    `Source: ${lead.source}`,
    `Package: ${lead.packageId ?? '—'}`,
    `Created at: ${lead.createdAt}`,
    '',
  ];

  if (lead.calculatorSummary) {
    textParts.push(buildCalculatorSummaryPlainOwner(lead.calculatorSummary), '');
  }

  textParts.push('Message', '-'.repeat(40), lead.message);

  const text = textParts.join('\n');

  return { html, text };
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

  const from = process.env.RESEND_FROM_EMAIL ?? 'SPM Lead <onboarding@resend.dev>';

  const resend = new Resend(apiKey);

  const { html, text } = buildOwnerNotificationBodies(lead);

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
    console.warn('Auto-reply skipped: invalid recipient email', {
      recipient: maskEmailForLog(lead.email),
      locale: lead.locale,
    });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(MISSING_KEY);
  }

  const from = process.env.RESEND_FROM_EMAIL ?? 'SPM Lead <onboarding@resend.dev>';

  const resend = new Resend(apiKey);
  const { subject, html, text } = buildAutoReplyHtml(lead);

  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject,
    html,
    text,
  });

  if (error) {
    const detail = formatResendErrorForAutoReply(error);
    throw new Error(`auto_reply_resend_failed: ${detail}`);
  }
}
