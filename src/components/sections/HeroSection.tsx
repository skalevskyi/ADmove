'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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
      className="relative overflow-hidden px-4 pt-12 pb-20 md:px-6 md:py-24"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-16 md:gap-y-6 lg:gap-x-20 lg:items-center">
          <motion.h1
            className="max-w-3xl break-words text-4xl leading-tight tracking-tight md:col-start-1 md:row-start-1 md:text-6xl"
            {...motionOpts}
          >
            <span className="block text-2xl md:text-4xl font-normal text-slate-600 dark:text-slate-400 tracking-tight mb-2 md:mb-3">
              {t.hero.headline_line1}
            </span>
            <span className="block text-4xl md:text-6xl font-bold text-slate-900 dark:text-white">
              {t.hero.headline_line2}
            </span>
          </motion.h1>
          <motion.p
            className="max-w-2xl whitespace-pre-line break-words text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:col-start-1 md:row-start-2"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.08 }}
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.p
            className="max-w-2xl break-words text-2xl font-semibold leading-relaxed text-slate-900 dark:text-white md:col-start-1 md:row-start-3"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.1 }}
          >
            {t.hero.proof}
          </motion.p>

          <motion.div
            className="md:col-start-1 md:row-start-4 md:hidden"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.16 }}
          >
            <a
              href="#contact"
              className={`inline-block w-full min-w-0 flex-1 rounded-2xl bg-gradient-to-b from-sky-500 to-sky-600 px-6 py-4 text-center text-base font-medium text-white transition-colors duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 md:w-auto md:rounded-lg md:py-3 ${focusRing}`}
            >
              {t.hero.ctaPrimary}
            </a>
          </motion.div>

          <motion.div
            className="hidden md:flex md:min-w-0 md:flex-row md:items-stretch md:gap-4 md:col-start-1 md:row-start-4 md:w-full"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.16 }}
          >
            <a
              href="#contact"
              className={`inline-block w-full min-w-0 flex-1 rounded-2xl bg-gradient-to-b from-sky-500 to-sky-600 px-6 py-4 text-center text-base font-medium text-white transition-colors duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 md:flex-1 md:min-w-0 md:rounded-lg md:py-3 ${focusRing}`}
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#support"
              className={`inline-block w-full min-w-0 flex-1 text-center ${ctaShapeBase} border border-slate-300 bg-white text-slate-700 transition-colors duration-150 ease-out hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-800 md:flex-1 md:min-w-0 ${focusRing}`}
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>

          {t.hero.support ? (
            <motion.p
              className="max-w-2xl break-words text-xs leading-relaxed text-slate-500 dark:text-slate-400 md:col-start-1 md:row-start-5"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.11 }}
            >
              {t.hero.support}
            </motion.p>
          ) : null}
          <motion.p
            className={`max-w-2xl break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:col-start-1 ${
              t.hero.support ? 'md:row-start-6' : 'md:row-start-5'
            }`}
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.12 }}
          >
            {t.hero.trust}
          </motion.p>

          <motion.div
            className={`max-w-2xl break-words space-y-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:col-start-1 ${
              t.hero.support ? 'md:row-start-7' : 'md:row-start-6'
            }`}
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.13 }}
          >
            <p>{t.hero.heroSeoLine1}</p>
            <p>
              {t.hero.heroSeoLine2Before}
              <Link
                href={withBasePath('/publicite-voiture-montpellier')}
                className={`text-slate-600 underline decoration-slate-400/70 underline-offset-2 transition-colors hover:text-sky-600 hover:decoration-sky-500 dark:text-slate-400 dark:decoration-slate-500/80 dark:hover:text-sky-400 dark:hover:decoration-sky-500/80 ${focusRing} rounded-sm`}
              >
                {t.hero.heroSeoLine2Link}
              </Link>
              {t.hero.heroSeoLine2After}
            </p>
          </motion.div>

          {/* Premium visual area: after primary CTA + supporting copy; desktop: col 2 */}
          <motion.div
            className={`relative max-md:-mt-2 max-md:-mb-2 md:col-start-2 md:row-start-1 md:self-center ${
              t.hero.support ? 'md:row-span-7' : 'md:row-span-6'
            }`}
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
          </motion.div>

          <motion.div
            className={`md:col-start-1 md:hidden ${
              t.hero.support ? 'md:row-start-8' : 'md:row-start-7'
            }`}
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.18 }}
          >
            <a
              href="#support"
              className={`inline-block w-full min-w-0 flex-1 text-center ${ctaShapeBase} border border-slate-300 bg-white text-slate-700 transition-colors duration-150 ease-out hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:active:bg-slate-800 md:w-auto ${focusRing}`}
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
