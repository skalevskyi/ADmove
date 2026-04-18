'use client';

import Link from 'next/link';

import { FloatingActions } from '@/components/FloatingActions';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { withBasePath } from '@/lib/base-path';

const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

const softButtonClass =
  'inline-flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm font-medium text-slate-900 transition-all hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-800/70 dark:hover:border-slate-600';

const ctaBtnShape =
  'inline-flex min-h-[56px] w-full items-center justify-center rounded-2xl px-8 text-sm font-medium transition-colors duration-150 ease-out sm:w-auto md:rounded-lg';

export function SeoAffichageMobileContent() {
  const { t } = useLanguage();
  const s = t.seoAffichageMobile;
  const section1Paragraphs = s.section1Text.split('\n\n');

  return (
    <>
      <Navbar useHomeAnchorHref />
      <main className="max-md:pb-[var(--shell-mobile-bottom-occupancy)] pt-[calc(4rem+env(safe-area-inset-top))] md:pb-0 md:pt-12">
        <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white px-4 py-12 dark:border-slate-800 dark:from-slate-900/95 dark:to-slate-900 md:px-6 md:py-16">
          <div className="mx-auto max-w-4xl">
            <h1 className="max-w-3xl break-words text-4xl leading-tight tracking-tight">
              <span className="block text-2xl md:text-4xl font-normal text-slate-600 dark:text-slate-400 tracking-tight mb-2 md:mb-3">
                {s.titleLine1}
              </span>
              <span className="block text-4xl md:text-6xl font-bold text-slate-900 dark:text-white">
                {s.titleLine2}
              </span>
            </h1>
            <p className="mt-4 text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-200 md:text-xl">
              {s.subtitle}
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
              {s.intro}
            </p>
          </div>
        </section>

        <section className="border-t border-slate-200 py-16 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                {s.section1Title}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {section1Paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/40 py-16 dark:border-slate-800 dark:bg-slate-900/25">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                {s.section2Title}
              </h2>
              <ol className="mt-8 list-decimal space-y-4 pl-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {s.section2Items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 py-16 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                {s.section3Title}
              </h2>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {s.section3Items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/40 py-16 dark:border-slate-800 dark:bg-slate-900/25">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                {s.section4Title}
              </h2>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {s.section4Items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 py-16 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                {s.section5Title}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {s.section5Text.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 pt-24 pb-16 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.internalLinkText}
                </p>
                <Link
                  href={withBasePath(s.internalLinkHref)}
                  className={`${softButtonClass} w-full shrink-0 md:w-auto ${focusRing}`}
                >
                  <span>{s.internalLinkLabel}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="seo-cta"
          className="border-t border-slate-200 bg-slate-100/40 py-16 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl">
                {s.ctaTitle}
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Link
                  href={withBasePath('/#offres')}
                  className={`${ctaBtnShape} bg-gradient-to-b from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-500 dark:hover:to-sky-300 ${focusRing}`}
                >
                  {s.ctaPrimary}
                </Link>
                <Link
                  href={withBasePath('/#contact')}
                  className={`${ctaBtnShape} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-800 ${focusRing}`}
                >
                  {s.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
      <MobileBottomNav useHomeAnchorHref />
      <FloatingActions />
    </>
  );
}
