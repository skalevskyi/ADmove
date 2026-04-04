'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';

import { OffreImageCarousel } from '@/components/offres/OffreImageCarousel';
import { OfferCalculatorPanel } from '@/components/sections/OfferCalculatorPanel';
import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BASE_PATH } from '@/lib/base-path';
import { calculateCalculator } from '@/lib/calculator';
import type { CalculatorSelection, DisplayMode, DurationMonths } from '@/lib/calculator/types';

const OFFRES = [
  {
    id: 'BASIC' as const,
    images: [`${BASE_PATH}/vehicle/basic-1.png`, `${BASE_PATH}/vehicle/basic-2.png`] as const,
    featured: false,
  },
  {
    id: 'PRO' as const,
    images: [`${BASE_PATH}/vehicle/pro-1.png`, `${BASE_PATH}/vehicle/pro-2.png`] as const,
    featured: true,
  },
  {
    id: 'EXCLUSIVE' as const,
    images: [`${BASE_PATH}/vehicle/exclusive-1.png`, `${BASE_PATH}/vehicle/exclusive-2.png`] as const,
    featured: false,
  },
];

type OfferId = (typeof OFFRES)[number]['id'];
const OFFER_INDEX: Record<OfferId, number> = { BASIC: 0, PRO: 1, EXCLUSIVE: 2 };
const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

export function OffresSection() {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const [expandedPackage, setExpandedPackage] = useState<OfferId | null>(null);
  const [switchDirection, setSwitchDirection] = useState<1 | -1>(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const prevPackageRef = useRef<OfferId | null>(null);

  const [durationMonths, setDurationMonths] = useState<DurationMonths>(3);
  const [weekendExposure, setWeekendExposure] = useState(false);
  const [photoReporting, setPhotoReporting] = useState(false);
  const [videoReporting, setVideoReporting] = useState(false);
  const [exclusivity, setExclusivity] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('monthly');

  const toggleCalculator = (id: OfferId) => {
    setExpandedPackage((prev) => {
      const next = prev === id ? null : id;
      if (prev !== null && next !== null) {
        const prevIndex = OFFER_INDEX[prev];
        const nextIndex = OFFER_INDEX[next];
        setSwitchDirection(nextIndex >= prevIndex ? 1 : -1);
      }

      if (next !== null) {
        requestAnimationFrame(() => {
          const el = previewRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const viewportH = window.innerHeight || 0;
          const notMeaningfullyVisible =
            rect.top > viewportH * 0.82 || rect.bottom < viewportH * 0.22;

          if (notMeaningfullyVisible) {
            el.scrollIntoView({
              behavior: reducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        });
      }

      return next;
    });
  };

  const selectedOffer = expandedPackage
    ? OFFRES.find((o) => o.id === expandedPackage) ?? null
    : null;

  const selectedName = selectedOffer
    ? selectedOffer.id === 'BASIC'
      ? t.offres.rear
      : selectedOffer.id === 'PRO'
        ? t.offres.side
        : t.offres.full
    : null;
  const selectedPositioning = selectedOffer
    ? selectedOffer.id === 'BASIC'
      ? t.offres.positioningRear
      : selectedOffer.id === 'PRO'
        ? t.offres.positioningSide
        : t.offres.positioningFull
    : null;

  const packageDescription = expandedPackage
    ? expandedPackage === 'BASIC'
      ? t.offres.descriptionRear
      : expandedPackage === 'PRO'
        ? t.offres.descriptionSide
        : t.offres.descriptionFull
    : '';
  const packageFeatured = Boolean(selectedOffer?.featured);

  useEffect(() => {
    if (expandedPackage === null) {
      prevPackageRef.current = null;
      return;
    }
    const prev = prevPackageRef.current;
    prevPackageRef.current = expandedPackage;

    if (prev === null || prev === expandedPackage) {
      return;
    }

    if (expandedPackage === 'BASIC') {
      setVideoReporting(false);
    }
    if (expandedPackage === 'PRO' || expandedPackage === 'EXCLUSIVE') {
      setPhotoReporting(false);
    }
    if (expandedPackage === 'EXCLUSIVE') {
      setExclusivity(false);
    }
    if (prev === 'EXCLUSIVE' && (expandedPackage === 'BASIC' || expandedPackage === 'PRO')) {
      setExclusivity(false);
    }
    if (prev === 'EXCLUSIVE' && expandedPackage === 'BASIC') {
      setVideoReporting(false);
    }
  }, [expandedPackage]);

  const selection: CalculatorSelection | null = useMemo(() => {
    if (!expandedPackage) return null;

    const base: CalculatorSelection = {
      packageId: expandedPackage,
      durationMonths,
      weekendExposure,
    };

    if (expandedPackage === 'BASIC') {
      return {
        ...base,
        photoReporting,
        exclusivity,
      };
    }
    if (expandedPackage === 'PRO') {
      return {
        ...base,
        videoReporting,
        exclusivity,
      };
    }
    return {
      ...base,
      videoReporting,
    };
  }, [durationMonths, expandedPackage, exclusivity, photoReporting, videoReporting, weekendExposure]);

  const calculatorResult = useMemo(() => {
    if (!selection) return null;
    return calculateCalculator(selection);
  }, [selection]);

  const formatEur = (value: number) => `€${Math.round(value)}`;

  return (
    <section
      id="offres"
      className="border-t border-slate-200 bg-slate-100/40 py-16 dark:border-slate-800 dark:bg-slate-900/40"
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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {OFFRES.map((offer, i) => {
            const name =
              offer.id === 'BASIC'
                ? t.offres.rear
                : offer.id === 'PRO'
                  ? t.offres.side
                  : t.offres.full;
            const isSelected = expandedPackage === offer.id;
            const positioning =
              offer.id === 'BASIC'
                ? t.offres.positioningRear
                : offer.id === 'PRO'
                  ? t.offres.positioningSide
                  : t.offres.positioningFull;
            const description =
              offer.id === 'BASIC'
                ? t.offres.descriptionRear
                : offer.id === 'PRO'
                  ? t.offres.descriptionSide
                  : t.offres.descriptionFull;
            const benefits =
              offer.id === 'BASIC'
                ? t.offres.benefitsRear
                : offer.id === 'PRO'
                  ? t.offres.benefitsSide
                  : t.offres.benefitsFull;
            const alt =
              offer.id === 'BASIC'
                ? t.offres.altRear
                : offer.id === 'PRO'
                  ? t.offres.altSide
                  : t.offres.altFull;
            return (
              <motion.article
                key={offer.id}
                className={`relative flex h-full flex-col rounded-2xl border bg-white dark:bg-slate-800/55 transition-shadow hover:shadow-md dark:hover:shadow-none ${
                  isSelected
                    ? 'border-sky-300 ring-2 ring-sky-500/20 dark:border-sky-700 dark:ring-sky-400/25'
                    : offer.featured
                      ? 'z-10 border-sky-200/95 shadow-lg shadow-slate-300/50 hover:shadow-xl hover:shadow-slate-300/55 dark:border-sky-800/55 dark:shadow-lg dark:shadow-slate-950/40 dark:hover:shadow-xl dark:hover:shadow-slate-950/50'
                      : 'border-slate-200 dark:border-slate-700'
                }`}
                initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : i * 0.08 }}
              >
                <div
                  className={`flex min-h-0 flex-1 flex-col p-6 ${offer.featured ? 'md:p-7' : ''}`}
                >
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                          {name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                          {positioning}
                        </p>
                      </div>
                      {offer.featured ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:border-sky-800/60 dark:bg-sky-900/40 dark:text-sky-300">
                          <BadgeCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                          {t.offres.badgeFeatured}
                        </span>
                      ) : null}
                    </div>

                    <OffreImageCarousel
                      packageId={offer.id}
                      images={offer.images}
                      alt={alt}
                      imageCarouselLabel={t.offres.imageCarouselLabel}
                      imageCarouselImage={t.offres.imageCarouselImage}
                      openGallery={t.offres.openGallery}
                      lightboxClose={t.offres.lightboxClose}
                    />

                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                      {description}
                    </p>

                    <ul className="mt-5 space-y-2">
                      {benefits.map((benefit, bi) => (
                        <li
                          key={bi}
                          className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400"
                            aria-hidden
                          />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {offer.id === 'EXCLUSIVE' ? (
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        {t.offres.exclusivityNote}
                      </p>
                    ) : (
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        {t.offres.competitionNote}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => toggleCalculator(offer.id)}
                      className={`block w-full rounded-lg bg-gradient-to-b from-sky-500 to-sky-600 py-2.5 text-center text-sm font-medium text-white transition-colors duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 ${focusRing}`}
                    >
                      {t.offres.calculer}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {expandedPackage !== null && selectedOffer !== null ? (
            <motion.div
              key="shared-preview"
              ref={previewRef}
              className="mt-10"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.24 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={expandedPackage}
                  initial={{
                    opacity: reducedMotion ? 1 : 0,
                    x: reducedMotion ? 0 : switchDirection * 18,
                    y: 0,
                  }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{
                    opacity: reducedMotion ? 1 : 0,
                    x: reducedMotion ? 0 : switchDirection * -18,
                    y: 0,
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.2 }}
                >
                  {calculatorResult ? (
                    <OfferCalculatorPanel
                      packageId={expandedPackage}
                      durationMonths={durationMonths}
                      setDurationMonths={setDurationMonths}
                      weekendExposure={weekendExposure}
                      setWeekendExposure={setWeekendExposure}
                      photoReporting={photoReporting}
                      setPhotoReporting={setPhotoReporting}
                      videoReporting={videoReporting}
                      setVideoReporting={setVideoReporting}
                      exclusivity={exclusivity}
                      setExclusivity={setExclusivity}
                      displayMode={displayMode}
                      setDisplayMode={setDisplayMode}
                      result={calculatorResult}
                      selectedName={selectedName ?? ''}
                      selectedPositioning={selectedPositioning ?? ''}
                      packageDescription={packageDescription}
                      packageFeatured={packageFeatured}
                      formatEur={formatEur}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
