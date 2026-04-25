'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays, Eye, Route } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { withBasePath } from '@/lib/base-path';
import { ctaShapeBase } from '@/lib/cta-shape';
import { HeroRouteVisual } from './HeroRouteVisual';

const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();

  const motionOpts = {
    initial: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.4 },
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-4 pt-10 pb-20 md:px-6 md:py-20"
    >
      {/* Premium minimal background: subtle gradient + optional soft radial glow */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-900/95 dark:to-slate-900"
        aria-hidden
      />
      <div
        className="absolute -top-1/2 right-0 h-full w-1/2 -translate-y-1/4 rounded-full bg-sky-500/[0.03] dark:bg-sky-400/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl">
        <motion.div className="max-w-5xl" {...motionOpts}>
          <h1 className="break-words text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
            <span className="mb-2 block text-2xl font-normal tracking-tight text-slate-600 dark:text-slate-400 md:mb-3 md:text-4xl">
              {t.hero.headline_line1}
            </span>
            <span className="block text-4xl font-bold text-slate-900 dark:text-white md:text-6xl">
              {t.hero.headline_line2}
            </span>
          </h1>
          <p className="mt-3 max-w-2xl whitespace-pre-line break-words text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:mt-4">
            {t.hero.subheadline}
          </p>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch md:gap-x-14 md:gap-y-4">
          <motion.div
            className="flex max-w-2xl flex-col gap-4 md:col-start-1 md:h-full md:justify-between"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.1 }}
          >
            <p className="break-words text-2xl font-semibold leading-relaxed text-slate-900 dark:text-white">
              {t.hero.proof}
            </p>

            <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
              <a
                href="#contact"
                className={`inline-block w-full min-w-0 flex-1 rounded-2xl bg-gradient-to-b from-sky-500 to-sky-600 px-6 py-4 text-center text-base font-medium text-white transition-colors duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 md:rounded-lg md:py-3 ${focusRing}`}
              >
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#support"
                className={`inline-block w-full min-w-0 flex-1 text-center ${ctaShapeBase} border border-slate-300 bg-white text-slate-700 transition-colors duration-150 ease-out hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-800 ${focusRing}`}
              >
                {t.hero.ctaSecondary}
              </a>
            </div>

            {t.hero.support ? (
              <p className="break-words text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {t.hero.support}
              </p>
            ) : null}
            <p className="break-words text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">
              {t.hero.trust}
            </p>

            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 md:text-sm">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{t.hero.heroSeoLine1}</span>
                <span>{t.hero.heroSeoLine2Before}</span>
                <Link
                  href={withBasePath('/publicite-voiture-montpellier')}
                  className={`whitespace-nowrap text-slate-600 underline decoration-slate-400/70 underline-offset-2 transition-colors hover:text-sky-600 hover:decoration-sky-500 dark:text-slate-400 dark:decoration-slate-500/80 dark:hover:text-sky-400 dark:hover:decoration-sky-500/80 ${focusRing} rounded-sm`}
                >
                  {t.hero.heroSeoLine2Link}
                  {t.hero.heroSeoLine2After}
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Premium visual area: desktop right column */}
          <motion.div
            className="relative flex w-full flex-col items-center -mt-6 md:col-start-2 md:-mt-14"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.06 }}
          >
            <HeroRouteVisual
              reducedMotion={reducedMotion}
              imageAlt={t.hero.imageAlt}
              routeAriaLabel={t.hero.routeVisualAriaLabel}
              vehicleAriaLabel={t.hero.routeVisualVehicleAriaLabel}
              locations={t.locations}
            />
            <div className="relative z-10 -mt-4 flex w-full flex-wrap items-center justify-center gap-2 md:-mt-10">
              <span className="whitespace-nowrap rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                <Route className="mr-1 inline h-4 w-4 text-sky-500" />
                {t.hero.chip_route}
              </span>
              <span className="whitespace-nowrap rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                <CalendarDays className="mr-1 inline h-4 w-4 text-sky-500" />
                {t.hero.chip_daily}
              </span>
              <span className="whitespace-nowrap rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                <Eye className="mr-1 inline h-4 w-4 text-sky-500" />
                {t.hero.chip_repeat}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
