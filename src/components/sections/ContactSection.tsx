'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { useCalculatorContactPrefill } from '@/context/CalculatorContactPrefillContext';
import { useLanguage } from '@/context/LanguageContext';
import type { TranslationKeys } from '@/i18n/types';
import type { AddonId, PackageId } from '@/lib/calculator/types';
import { buildContactPrefillMessage, type CalculatorContactPrefillPayload } from '@/lib/contactPrefillMessage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { trackSpmEvent } from '@/lib/analytics/client';
import { ctaShapeBase } from '@/lib/cta-shape';
import { withBasePath } from '@/lib/base-path';
import type { CalculatorSummary, LeadApiResponse } from '@/lib/lead/types';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

const NAME_MIN = 2;
const NAME_MAX = 120;
const MESSAGE_MIN = 5;
const MESSAGE_MAX = 2000;
const COMPANY_MAX = 160;
const PHONE_MAX = 50;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Maps Zod issue codes from the API to i18n validation keys. */
function mapServerCodeToMessageKey(code: string): 'required' | 'invalid' | 'tooLong' {
  if (code === 'min_length') return 'required';
  if (code === 'invalid_email') return 'invalid';
  if (code === 'max_length') return 'tooLong';
  return 'invalid';
}

function validateNameBlur(value: string): string | undefined {
  const t = value.trim();
  if (t.length === 0) return 'min_length';
  if (t.length < NAME_MIN) return 'min_length';
  if (t.length > NAME_MAX) return 'max_length';
  return undefined;
}

function validateEmailBlur(value: string): string | undefined {
  const t = value.trim();
  if (t.length === 0) return 'min_length';
  if (!EMAIL_PATTERN.test(t)) return 'invalid_email';
  if (t.length > 160) return 'max_length';
  return undefined;
}

function validateMessageBlur(value: string): string | undefined {
  const t = value.trim();
  if (t.length === 0) return 'min_length';
  if (t.length < MESSAGE_MIN) return 'min_length';
  if (t.length > MESSAGE_MAX) return 'max_length';
  return undefined;
}

function validateCompanyBlur(value: string): string | undefined {
  const t = value.trim();
  if (t.length > COMPANY_MAX) return 'max_length';
  return undefined;
}

function validatePhoneBlur(value: string): string | undefined {
  const t = value.trim();
  if (t.length > PHONE_MAX) return 'max_length';
  return undefined;
}

function packageLabelFromId(t: TranslationKeys, packageId: PackageId): string {
  switch (packageId) {
    case 'BASIC':
      return t.offres.rear;
    case 'PRO':
      return t.offres.side;
    case 'EXCLUSIVE':
      return t.offres.full;
    default:
      return packageId;
  }
}

function addonLabelFromId(t: TranslationKeys, id: AddonId): string {
  switch (id) {
    case 'extra_route_day':
      return t.offres.calculatorAddonWeekendExposure;
    case 'photo_reporting':
      return t.offres.calculatorAddonPhotoReporting;
    case 'video_reporting':
      return t.offres.calculatorAddonVideoReporting;
    case 'exclusivity':
      return t.offres.calculatorAddonExclusivity;
    case 'priority_booking':
      return t.offres.calculatorOneTimeFeesLabel;
    default:
      return '';
  }
}

function buildCalculatorSummaryFromPayload(
  t: TranslationKeys,
  payload: CalculatorContactPrefillPayload,
): CalculatorSummary {
  const packageLabel = packageLabelFromId(t, payload.packageId);
  const paymentMode: string =
    payload.displayMode === 'monthly'
      ? t.offres.calculatorModeMonthly
      : t.offres.calculatorModeContractTotal;
  const addons = payload.activeAddonIds.map((id) => {
    const label = addonLabelFromId(t, id);
    return label.trim() !== '' ? label : id;
  });
  return {
    packageLabel,
    paymentMode,
    durationMonths: payload.durationMonths,
    addons,
    totalPrice: payload.totalPriceEur,
  };
}

const inputBase =
  'mt-1 w-full rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 ease-out focus:outline-none dark:text-white dark:placeholder-slate-500';
const inputNormal =
  'border border-slate-300 bg-white hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/15 dark:border-slate-600/80 dark:bg-slate-900/40 dark:hover:border-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500/20 dark:focus-visible:border-sky-500';
const inputError =
  'border border-red-500 bg-red-50/60 focus:border-red-600 focus:ring-2 focus:ring-red-500/20 focus-visible:border-red-600 focus-visible:ring-2 focus-visible:ring-red-500/20 dark:border-red-500 dark:bg-red-950/30 dark:focus:border-red-500 dark:focus:ring-red-900/30 dark:focus-visible:border-red-500';

type FieldErrorProps = {
  id: string;
  message: string | undefined;
  reducedMotion: boolean;
};

function FieldError({ id, message, reducedMotion }: FieldErrorProps) {
  if (!message) return null;
  return (
    <motion.div
      id={id}
      role="alert"
      initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.22, ease: 'easeOut' }}
      className="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {message}
    </motion.div>
  );
}

/**
 * Contact section — submits leads to POST /api/lead.
 */
export function ContactSection() {
  const reducedMotion = useReducedMotion();
  const { t, locale } = useLanguage();
  const {
    payload: calculatorPrefillPayload,
    setPayload: setCalculatorPrefillPayload,
  } = useCalculatorContactPrefill();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitErrorKind, setSubmitErrorKind] = useState<'generic' | 'rateLimited'>('generic');
  const [message, setMessage] = useState('');
  /** True while the textarea still reflects the last calculator-generated prefill (not user-edited). */
  const messageFromCalculatorRef = useRef(false);
  /** Last calculator payload applied to the form (context clears after prefill). */
  const lastCalculatorPayloadRef = useRef<CalculatorContactPrefillPayload | null>(null);

  useEffect(() => {
    if (!calculatorPrefillPayload) return;
    trackSpmEvent('calculator_prefill_used', {
      packageId: calculatorPrefillPayload.packageId,
    });
    setMessage((prev) => {
      if (prev.trim() !== '' && !messageFromCalculatorRef.current) return prev;
      const next = buildContactPrefillMessage(t, calculatorPrefillPayload, locale);
      messageFromCalculatorRef.current = true;
      lastCalculatorPayloadRef.current = calculatorPrefillPayload;
      return next;
    });
    setCalculatorPrefillPayload(null);
  }, [calculatorPrefillPayload, locale, setCalculatorPrefillPayload, t]);

  const messageForCode = useCallback(
    (code: string) => {
      const key = mapServerCodeToMessageKey(code);
      return t.contact.validation[key];
    },
    [t],
  );

  const fieldMessage = useCallback(
    (field: string) => {
      const code = fieldErrors[field];
      if (!code) return undefined;
      return messageForCode(code);
    },
    [fieldErrors, messageForCode],
  );

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  function handleResetSuccess() {
    setFieldErrors({});
    setStatus('idle');
    setMessage('');
    lastCalculatorPayloadRef.current = null;
    messageFromCalculatorRef.current = false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setSubmitErrorKind('generic');
    setStatus('loading');

    const form = e.currentTarget;
    const fd = new FormData(form);
    const lastCalc = lastCalculatorPayloadRef.current;
    const leadOrigin = lastCalc ? ('calculator' as const) : ('contact' as const);
    const calculatorSummary = lastCalc ? buildCalculatorSummaryFromPayload(t, lastCalc) : undefined;

    const payload = {
      name: String(fd.get('name') ?? ''),
      company: String(fd.get('company') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message: String(fd.get('message') ?? ''),
      locale,
      source: 'contact' as const,
      packageId: null as string | null,
      leadOrigin,
      ...(calculatorSummary ? { calculatorSummary } : {}),
    };

    try {
      const res = await fetch(withBasePath('/api/lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: LeadApiResponse;
      try {
        data = (await res.json()) as LeadApiResponse;
      } catch {
        setSubmitErrorKind('generic');
        setStatus('error');
        return;
      }

      if (res.status === 400 && data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
        setStatus('idle');
        setFieldErrors(data.fieldErrors);
        return;
      }

      if (res.status === 429 || data.error === 'rate_limited') {
        setSubmitErrorKind('rateLimited');
        setStatus('error');
        return;
      }

      if (res.ok && data.ok) {
        trackSpmEvent('lead_submitted', {
          locale,
          leadOrigin,
          hasCalculatorSummary: calculatorSummary !== undefined,
        });

        form.reset();
        setMessage('');
        messageFromCalculatorRef.current = false;
        lastCalculatorPayloadRef.current = null;
        setStatus('success');
        return;
      }

      setSubmitErrorKind('generic');
      setStatus('error');
    } catch {
      setSubmitErrorKind('generic');
      setStatus('error');
    }
  }

  const showGlobalError = status === 'error';

  return (
    <section
      id="contact"
      className="py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-xl md:max-w-2xl">
          <motion.h2
            className="text-center text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
          >
            {t.contact.title}
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-center text-slate-600 leading-relaxed dark:text-slate-300"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.05 }}
          >
            {t.contact.subtitle}
          </motion.p>

          {status === 'success' ? (
            <motion.div
              className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 md:p-10 dark:border-slate-700 dark:bg-slate-800/70"
              role="status"
              aria-live="polite"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40"
                  aria-hidden
                >
                  <svg
                    className="h-7 w-7 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
                  {t.contact.success.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.contact.success.description}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t.contact.success.responseTime}
                </p>
                <p className="mt-5 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {t.contact.success.reassurance}
                </p>
                <button
                  type="button"
                  onClick={handleResetSuccess}
                  className={`mt-8 w-full max-w-sm rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 ease-out hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-800 ${focusRing}`}
                >
                  {t.contact.success.resetButton}
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-10">
              <motion.div
                className="relative space-y-5 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-700 dark:bg-slate-800/70"
                initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.1 }}
              >
                {showGlobalError ? (
                  <p
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-100"
                    role="alert"
                  >
                    {submitErrorKind === 'rateLimited' ? t.contact.submitErrorRateLimited : t.contact.submitError}
                  </p>
                ) : null}
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.name}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                    onChange={() => clearFieldError('name')}
                    onBlur={(e) => {
                      const err = validateNameBlur(e.target.value);
                      setFieldErrors((p) => {
                        const next = { ...p };
                        if (err) next.name = err;
                        else delete next.name;
                        return next;
                      });
                    }}
                    className={`${inputBase} ${fieldErrors.name ? inputError : inputNormal}`}
                    placeholder={t.contact.placeholderName}
                  />
                  <FieldError
                    id="contact-name-error"
                    message={fieldMessage('name')}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.company}
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    autoComplete="organization"
                    aria-invalid={Boolean(fieldErrors.company)}
                    aria-describedby={fieldErrors.company ? 'contact-company-error' : undefined}
                    onChange={() => clearFieldError('company')}
                    onBlur={(e) => {
                      const err = validateCompanyBlur(e.target.value);
                      setFieldErrors((p) => {
                        const next = { ...p };
                        if (err) next.company = err;
                        else delete next.company;
                        return next;
                      });
                    }}
                    className={`${inputBase} ${fieldErrors.company ? inputError : inputNormal}`}
                    placeholder={t.contact.placeholderCompany}
                  />
                  <FieldError
                    id="contact-company-error"
                    message={fieldMessage('company')}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.email}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                    onChange={() => clearFieldError('email')}
                    onBlur={(e) => {
                      const err = validateEmailBlur(e.target.value);
                      setFieldErrors((p) => {
                        const next = { ...p };
                        if (err) next.email = err;
                        else delete next.email;
                        return next;
                      });
                    }}
                    className={`${inputBase} ${fieldErrors.email ? inputError : inputNormal}`}
                    placeholder={t.contact.placeholderEmail}
                  />
                  <FieldError
                    id="contact-email-error"
                    message={fieldMessage('email')}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.phone}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                    onChange={() => clearFieldError('phone')}
                    onBlur={(e) => {
                      const err = validatePhoneBlur(e.target.value);
                      setFieldErrors((p) => {
                        const next = { ...p };
                        if (err) next.phone = err;
                        else delete next.phone;
                        return next;
                      });
                    }}
                    className={`${inputBase} ${fieldErrors.phone ? inputError : inputNormal}`}
                    placeholder={t.contact.placeholderPhone}
                  />
                  <FieldError
                    id="contact-phone-error"
                    message={fieldMessage('phone')}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.contact.message}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={message}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      messageFromCalculatorRef.current = false;
                      lastCalculatorPayloadRef.current = null;
                      clearFieldError('message');
                    }}
                    onBlur={(e) => {
                      const err = validateMessageBlur(e.target.value);
                      setFieldErrors((p) => {
                        const next = { ...p };
                        if (err) next.message = err;
                        else delete next.message;
                        return next;
                      });
                    }}
                    className={`${inputBase} break-words md:min-h-[160px] ${fieldErrors.message ? inputError : inputNormal}`}
                    placeholder={t.contact.placeholderMessage}
                  />
                  <FieldError
                    id="contact-message-error"
                    message={fieldMessage('message')}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div className="sr-only" aria-hidden>
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  aria-busy={status === 'loading'}
                  className={`flex w-full items-center justify-center gap-2 ${ctaShapeBase} bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:brightness-[1.03] active:scale-[0.98] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:brightness-100 disabled:active:scale-100 dark:from-sky-500 dark:to-sky-400 dark:focus-visible:ring-offset-slate-900 dark:hover:brightness-110 dark:disabled:hover:brightness-100`}
                >
                  {status === 'loading' ? (
                    <>
                      <span
                        className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/35 border-t-white"
                        aria-hidden
                      />
                      <span>{t.contact.submitLoading}</span>
                    </>
                  ) : (
                    t.contact.submit
                  )}
                </button>
                <p className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400">
                  {t.contact.submitMicrocopy}
                </p>
                <p className="mt-3 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {t.contact.reassurance}
                </p>
              </motion.div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
