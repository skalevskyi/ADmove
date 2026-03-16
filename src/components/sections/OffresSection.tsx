'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BASE_PATH } from '@/lib/base-path';

const OFFRES = [
  { id: 'rear' as const, image: `${BASE_PATH}/vehicle/rear.png`, featured: false },
  { id: 'side' as const, image: `${BASE_PATH}/vehicle/side.png`, featured: true },
  { id: 'full' as const, image: `${BASE_PATH}/vehicle/full.png`, featured: false },
];

type OfferId = (typeof OFFRES)[number]['id'];
const CALC_DURATION = 0.28;
const focusRing =
  'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900';

export function OffresSection() {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const [expandedPackage, setExpandedPackage] = useState<OfferId | null>(null);

  const toggleCalculator = (id: OfferId) => {
    setExpandedPackage((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="offres"
      className="border-t border-slate-200 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-900/30"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.h2
          className="text-center text-3xl font-bold text-slate-900 dark:text-white md:text-4xl"
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
        >
          {t.offres.title}
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-center text-slate-600 dark:text-slate-300"
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.05 }}
        >
          {t.offres.subtitle}
        </motion.p>
        <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch md:items-stretch">
          {OFFRES.map((offer, i) => {
            const name = t.offres[offer.id];
            const positioning =
              offer.id === 'rear'
                ? t.offres.positioningRear
                : offer.id === 'side'
                  ? t.offres.positioningSide
                  : t.offres.positioningFull;
            const description =
              offer.id === 'rear'
                ? t.offres.descriptionRear
                : offer.id === 'side'
                  ? t.offres.descriptionSide
                  : t.offres.descriptionFull;
            const note =
              offer.id === 'rear'
                ? t.offres.noteRear
                : offer.id === 'side'
                  ? t.offres.noteSide
                  : t.offres.noteFull;
            const benefits =
              offer.id === 'rear'
                ? t.offres.benefitsRear
                : offer.id === 'side'
                  ? t.offres.benefitsSide
                  : t.offres.benefitsFull;
            const useCase =
              offer.id === 'rear'
                ? t.offres.useCaseRear
                : offer.id === 'side'
                  ? t.offres.useCaseSide
                  : t.offres.useCaseFull;
            const alt =
              offer.id === 'rear'
                ? t.offres.altRear
                : offer.id === 'side'
                  ? t.offres.altSide
                  : t.offres.altFull;
            return (
              <motion.article
                key={offer.id}
                className={`flex h-full flex-col rounded-2xl border bg-white dark:bg-slate-800/50 ${
                  offer.featured
                    ? 'border-sky-200 ring-1 ring-sky-500/20 dark:border-sky-800/60 dark:ring-sky-400/20'
                    : 'border-slate-200 dark:border-slate-700'
                } transition-shadow hover:shadow-md dark:hover:shadow-none`}
                initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : i * 0.08 }}
              >
                <div className="flex min-h-[360px] flex-col flex-1 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {name}
                    </h3>
                    {offer.featured && (
                      <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                        {t.offres.badgeFeatured}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {positioning}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {description}
                  </p>

                  <div className="relative mt-6 h-40 w-full flex-shrink-0">
                    <Image
                      src={offer.image}
                      alt={alt}
                      fill
                      className="object-contain"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>

                  <ul className="mt-5 space-y-2">
                    {benefits.map((benefit, bi) => (
                      <li
                        key={bi}
                        className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400" aria-hidden />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                    {useCase}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                    {note}
                  </p>

                  <div className="mt-6 flex-1 flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={() => toggleCalculator(offer.id)}
                      className={`block w-full rounded-lg bg-slate-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 ${focusRing}`}
                    >
                      {t.offres.calculer}
                    </button>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <AnimatePresence initial={false}>
                    {expandedPackage === offer.id && (
                      <motion.div
                        initial={{ opacity: reducedMotion ? 1 : 0, height: reducedMotion ? 'auto' : 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: reducedMotion ? 1 : 0, height: reducedMotion ? 'auto' : 0 }}
                        transition={{ duration: reducedMotion ? 0 : CALC_DURATION }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-slate-800/80">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {t.offres.simTitle}
                          </h4>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {t.offres.hint}
                          </p>
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {t.offres.simDuration}
                              </label>
                              <div className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {t.offres.simDurationValue}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {t.offres.simZone}
                              </label>
                              <div className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {t.offres.simZoneValue}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {t.offres.simObjective}
                              </label>
                              <div className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {t.offres.simObjectiveValue}
                              </div>
                            </div>
                          </div>
                          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                            {t.offres.simDisclaimer}
                          </p>
                          <a
                            href="#contact"
                            className={`mt-4 block w-full rounded-lg bg-slate-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 ${focusRing}`}
                          >
                            {t.offres.ctaEstimation}
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
