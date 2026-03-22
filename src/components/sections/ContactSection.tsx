'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { LeadApiResponse } from '@/lib/lead/types';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Contact section — submits leads to POST /api/lead.
 */
export function ContactSection() {
  const reducedMotion = useReducedMotion();
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validationHint(field: 'name' | 'email' | 'message'): string | undefined {
    if (!fieldErrors[field]) return undefined;
    return t.contact.validation[field];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setStatus('loading');

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get('name') ?? ''),
      company: String(fd.get('company') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message: String(fd.get('message') ?? ''),
      locale,
      source: 'contact' as const,
      packageId: null as string | null,
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: LeadApiResponse;
      try {
        data = (await res.json()) as LeadApiResponse;
      } catch {
        setStatus('error');
        return;
      }

      if (res.status === 400 && data.fieldErrors) {
        setStatus('idle');
        setFieldErrors(data.fieldErrors);
        return;
      }

      if (!res.ok || !data.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      className="py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-xl">
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
          <form onSubmit={handleSubmit} noValidate className="mt-10">
            <motion.div
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-700 dark:bg-slate-800/70"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.1 }}
            >
            {status === 'success' ? (
              <p
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                role="status"
              >
                {t.contact.submitSuccess}
              </p>
            ) : null}
            {status === 'error' ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-100"
                role="alert"
              >
                {t.contact.submitError}
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
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus-visible:border-slate-500 focus-visible:ring-1 focus-visible:ring-slate-300/70 dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 dark:focus-visible:border-slate-400 dark:focus-visible:ring-slate-600/60"
                placeholder={t.contact.placeholderName}
              />
              {validationHint('name') ? (
                <p id="contact-name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationHint('name')}
                </p>
              ) : null}
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
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus-visible:border-slate-500 focus-visible:ring-1 focus-visible:ring-slate-300/70 dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 dark:focus-visible:border-slate-400 dark:focus-visible:ring-slate-600/60"
                placeholder={t.contact.placeholderCompany}
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
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus-visible:border-slate-500 focus-visible:ring-1 focus-visible:ring-slate-300/70 dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 dark:focus-visible:border-slate-400 dark:focus-visible:ring-slate-600/60"
                placeholder={t.contact.placeholderEmail}
              />
              {validationHint('email') ? (
                <p id="contact-email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationHint('email')}
                </p>
              ) : null}
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
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus-visible:border-slate-500 focus-visible:ring-1 focus-visible:ring-slate-300/70 dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 dark:focus-visible:border-slate-400 dark:focus-visible:ring-slate-600/60"
                placeholder={t.contact.placeholderPhone}
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
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus-visible:border-slate-500 focus-visible:ring-1 focus-visible:ring-slate-300/70 dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-white dark:placeholder-slate-500 dark:focus-visible:border-slate-400 dark:focus-visible:ring-slate-600/60"
                placeholder={t.contact.placeholderMessage}
              />
              {validationHint('message') ? (
                <p id="contact-message-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationHint('message')}
                </p>
              ) : null}
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t.contact.reassurance}
            </p>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-gradient-to-b from-sky-500 to-sky-600 py-3 font-medium text-white transition-colors duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 dark:focus-visible:ring-slate-500/70"
            >
              {status === 'loading' ? t.contact.submitLoading : t.contact.submit}
            </button>
            </motion.div>
          </form>
        </div>
      </div>
    </section>
  );
}
