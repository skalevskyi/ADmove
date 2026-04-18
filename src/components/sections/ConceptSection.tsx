'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CircleCheck, Layers, Route, Sparkles } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { withBasePath } from '@/lib/base-path';

const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

const exploreLinkClass =
  'inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-center text-sm font-medium text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/55 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800/80 md:flex-1';

export function ConceptSection() {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: reducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reducedMotion ? 0 : 0.08 },
    },
  };

  const item = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 },
    visible: { opacity: 1, y: 0 },
  };

  const steps = t.support.steps;

  return (
    <section
      id="support"
      className="border-t border-slate-200 bg-slate-50/40 py-16 dark:border-slate-800 dark:bg-slate-900/25"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
        <motion.h2
          className="text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl"
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
        >
          {t.support.title}
        </motion.h2>
        <motion.p
          className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg"
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.05 }}
        >
          {t.support.subtitle}
        </motion.p>
        <motion.div
          className="mt-10 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/55"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="grid gap-6 text-slate-600 dark:text-slate-300 md:grid-cols-2 md:gap-8">
            {steps.map((step, index) => {
              const Icon =
                index === 0
                  ? Layers
                  : index === 1
                    ? CircleCheck
                    : index === 2
                      ? Route
                      : Sparkles;
              return (
                <motion.div
                  key={index}
                  variants={item}
                  className="flex min-w-0 items-start gap-3"
                >
                  <Icon
                    className="mt-0.5 h-5 w-5 shrink-0 stroke-[2] text-sky-600 dark:text-sky-400"
                    aria-hidden
                  />
                  <div className="min-w-0 space-y-1.5">
                    <h3 className="text-sm font-semibold leading-snug text-slate-900 dark:text-white">
                      <span className="mr-1.5 inline-block font-tabular-nums text-sky-600 dark:text-sky-400">
                        {index + 1}.
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 break-words">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-slate-200/80 pt-5 dark:border-slate-700/70">
            <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-white">
              {t.support.methodologyTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 break-words">
              {t.support.methodologyText}
            </p>
          </div>
        </motion.div>

        <div className="mt-10">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.support.conceptExploreLabel}
          </p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:gap-4">
            <Link
              href={withBasePath('/affichage-mobile-montpellier')}
              className={`${exploreLinkClass} ${focusRing}`}
            >
              {t.support.conceptExploreLink1}
            </Link>
            <Link
              href={withBasePath('/publicite-locale-montpellier')}
              className={`${exploreLinkClass} ${focusRing}`}
            >
              {t.support.conceptExploreLink2}
            </Link>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
