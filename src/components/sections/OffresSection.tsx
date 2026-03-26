'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BASE_PATH } from '@/lib/base-path';
import { calculateCalculator } from '@/lib/calculator';
import type { CalculatorSelection, DisplayMode, DurationMonths } from '@/lib/calculator/types';

const OFFRES = [
  { id: 'BASIC' as const, image: `${BASE_PATH}/vehicle/BASIC.png`, featured: false },
  { id: 'PRO' as const, image: `${BASE_PATH}/vehicle/PRO.png`, featured: true },
  { id: 'EXCLUSIVE' as const, image: `${BASE_PATH}/vehicle/EXCLUSIVE.png`, featured: false },
];

type OfferId = (typeof OFFRES)[number]['id'];
const CALC_DURATION = 0.28;
const OFFER_INDEX: Record<OfferId, number> = { BASIC: 0, PRO: 1, EXCLUSIVE: 2 };
const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

export function OffresSection() {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const [expandedPackage, setExpandedPackage] = useState<OfferId | null>(null);
  const [switchDirection, setSwitchDirection] = useState<1 | -1>(1);
  const previewRef = useRef<HTMLDivElement>(null);

  // Calculator UI input state (no computed values stored).
  const [durationMonths, setDurationMonths] = useState<DurationMonths>(3);
  const [photoReporting, setPhotoReporting] = useState(false);
  const [videoReporting, setVideoReporting] = useState(false);
  const [priorityBooking, setPriorityBooking] = useState(false);
  const [exclusivity, setExclusivity] = useState(false);
  const [extraRouteDays, setExtraRouteDays] = useState(0);
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

  useEffect(() => {
    // Reset only user inputs when switching the selected package.
    // Keeps engine validation safe (e.g. BASIC cannot enable video).
    if (expandedPackage === null) return;
    setDurationMonths(3);
    setPhotoReporting(false);
    setVideoReporting(false);
    setPriorityBooking(false);
    setExclusivity(false);
    setExtraRouteDays(0);
    setDisplayMode('monthly');
  }, [expandedPackage]);

  const selection: CalculatorSelection | null = useMemo(() => {
    if (!expandedPackage) return null;

    // Build selection object so we NEVER pass forbidden keys for EXCLUSIVE
    // (e.g. exclusivity toggle key must be absent, not just undefined).
    const base = {
      packageId: expandedPackage,
      durationMonths,
      extraRouteDays,
      videoReporting,
    } as const;

    const sel: CalculatorSelection = {
      ...base,
      ...(expandedPackage === 'BASIC' ? { photoReporting } : {}),
      ...(expandedPackage !== 'EXCLUSIVE' ? { priorityBooking, exclusivity } : {}),
    };

    return sel;
  }, [durationMonths, expandedPackage, exclusivity, extraRouteDays, photoReporting, priorityBooking, videoReporting]);

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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 items-start md:items-start">
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
                className={`relative self-start flex flex-col rounded-2xl border bg-white dark:bg-slate-800/55 transition-shadow hover:shadow-md dark:hover:shadow-none ${
                  isSelected
                    ? 'border-sky-300 ring-2 ring-sky-500/20 dark:border-sky-700 dark:ring-sky-400/25'
                    : offer.featured
                      ? 'border-sky-200 ring-1 ring-sky-500/20 dark:border-sky-800/60 dark:ring-sky-400/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
                initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : i * 0.08 }}
              >
                <div className="flex min-h-[340px] flex-col p-6">
                  {/* Top area: label + optional recommended badge */}
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
                      <span className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:border-sky-800/60 dark:bg-sky-900/40 dark:text-sky-300">
                        {t.offres.badgeFeatured}
                      </span>
                    ) : null}
                  </div>

                  {/* Visual area: vehicle mockup */}
                  <div className="relative mt-6 flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 px-4 dark:border-slate-600/80 dark:bg-slate-700/35">
                    <Image
                      src={offer.image}
                      alt={alt}
                      fill
                      className="object-contain object-center"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </div>

                  {/* Short card description */}
                  <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                    {description}
                  </p>

                  {/* Value bullets */}
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

                  {/* CTA area */}
                  <div className="mt-6">
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
              <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/80 p-6 md:p-8 dark:border-slate-600 dark:bg-slate-900/90">
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
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                      {t.offres.simTitle}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {t.offres.hint}
                    </p>

                    <div className="mt-5 space-y-2.5">
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                        <span className="mr-2 inline-block font-medium uppercase tracking-wide text-slate-500 dark:text-slate-300">
                          {t.offres.simFormatLabel}:
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {selectedName}
                        </span>
                      </p>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                        {selectedPositioning}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                        {t.offres.simAdapted}
                      </p>
                    </div>

                    {calculatorResult && calculatorResult.ok ? (
                      <div className="mt-5 space-y-4">
                        {/* Duration */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.offres.simDuration}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {[3, 6, 9, 12].map((m) => {
                              const isActive = durationMonths === m;
                              return (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setDurationMonths(m as DurationMonths)}
                                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400/70 ${
                                    isActive
                                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-800/30 dark:text-slate-200 dark:hover:bg-slate-800/60'
                                  }`}
                                >
                                  {m} {t.offres.calculatorDurationUnit}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Add-ons toggles */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.offres.calculatorAddonsTitle}
                          </p>
                          <div className="mt-2 space-y-3">
                            {calculatorResult.addOnEligibility.map((addon) => {
                              const isIncluded = addon.includedByDefinition;
                              const isAvailable = addon.available;
                              const isActive = addon.active;

                              const label =
                                addon.addonId === 'photo_reporting'
                                  ? t.offres.calculatorAddonPhotoReporting
                                  : addon.addonId === 'video_reporting'
                                    ? t.offres.calculatorAddonVideoReporting
                                    : addon.addonId === 'extra_route_day'
                                      ? t.offres.calculatorAddonExtraRouteDay
                                      : addon.addonId === 'priority_booking'
                                        ? t.offres.calculatorAddonPriorityBooking
                                        : t.offres.calculatorAddonExclusivity;

                              return (
                                <div
                                  key={addon.addonId}
                                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white/70 px-3 py-3 dark:border-slate-600/70 dark:bg-slate-700/30"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                      {label}
                                    </p>
                                    {isIncluded ? (
                                      <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                        {t.offres.calculatorBadgeIncluded}
                                      </p>
                                    ) : isAvailable ? (
                                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {addon.addonId === 'priority_booking' && isActive
                                          ? formatEur(addon.chargedOneTimeEur)
                                          : addon.addonId !== 'priority_booking' && isActive
                                            ? `${formatEur(addon.chargedMonthlyEur)}${t.offres.calculatorPerMonthSuffix}`
                                            : ''}
                                      </p>
                                    ) : (
                                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        {t.offres.calculatorBadgeNotAvailable}
                                      </p>
                                    )}
                                  </div>

                                  {addon.addonId === 'extra_route_day' ? (
                                    addon.available ? (
                                      // Extra route days is a quantity input, not a checkbox.
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setExtraRouteDays((d) => Math.max(0, d - 1))}
                                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600/70 dark:bg-slate-800/30 dark:text-slate-200 dark:hover:bg-slate-800/60"
                                        >
                                          −
                                        </button>
                                        <input
                                          type="number"
                                          min={0}
                                          max={10}
                                          step={1}
                                          value={extraRouteDays}
                                          onChange={(e) => {
                                            const raw = Number(e.target.value);
                                            const next = Number.isFinite(raw) ? raw : 0;
                                            setExtraRouteDays(Math.max(0, Math.min(10, Math.floor(next))));
                                          }}
                                          className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-sm text-slate-800 outline-none focus-visible:ring-1 focus-visible:ring-sky-400/70 dark:border-slate-600/70 dark:bg-slate-800/30 dark:text-slate-200"
                                          aria-label={t.offres.calculatorAddonExtraRouteDay}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setExtraRouteDays((d) => Math.min(10, d + 1))}
                                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600/70 dark:bg-slate-800/30 dark:text-slate-200 dark:hover:bg-slate-800/60"
                                        >
                                          +
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                        {isIncluded ? '—' : ''}
                                      </span>
                                    )
                                  ) : isIncluded || !isAvailable ? (
                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                      {isIncluded ? '—' : ''}
                                    </span>
                                  ) : (
                                    <input
                                      type="checkbox"
                                      checked={isActive}
                                      onChange={(e) => {
                                        const next = e.target.checked;
                                        if (addon.addonId === 'photo_reporting') setPhotoReporting(next);
                                        else if (addon.addonId === 'video_reporting') setVideoReporting(next);
                                        else if (addon.addonId === 'priority_booking') setPriorityBooking(next);
                                        else if (addon.addonId === 'exclusivity') setExclusivity(next);
                                      }}
                                      aria-label={label}
                                      className="h-4 w-4 accent-sky-600"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Price display mode */}
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.offres.calculatorPriceModeTitle}
                          </p>
                          <div className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-600/70 dark:bg-slate-800/30">
                            <button
                              type="button"
                              onClick={() => setDisplayMode('monthly')}
                              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
                                displayMode === 'monthly'
                                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              {t.offres.calculatorModeMonthly}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDisplayMode('contract_total')}
                              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out ${
                                displayMode === 'contract_total'
                                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              {t.offres.calculatorModeContractTotal}
                            </button>
                          </div>
                        </div>

                        {/* Contacts + price summary */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700/70 dark:bg-slate-900/50">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {t.offres.calculatorContactsLabel}
                          </p>
                          <p className="mt-1 text-3xl font-bold leading-tight text-slate-900 dark:text-white">
                            {calculatorResult.indicativeMonthlyContacts.toLocaleString()}
                          </p>

                          {displayMode === 'monthly' ? (
                            <div className="mt-4 space-y-1">
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {t.offres.calculatorFromMonth2Label}
                              </p>
                              <p className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                                {formatEur(calculatorResult.monthlyView.fromMonth2TotalEur)}
                                {t.offres.calculatorPerMonthSuffix}
                              </p>
                              {calculatorResult.monthlyView.month1TotalEur > 0 ? (
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                  {t.offres.calculatorMonth1Label}: {formatEur(calculatorResult.monthlyView.month1TotalEur)}
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <div className="mt-4 space-y-1">
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {t.offres.calculatorContractTotalLabel}
                              </p>
                              <p className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                                {formatEur(calculatorResult.contractTotalView.contractTotalEur)}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {t.offres.calculatorMonth1Label}: {formatEur(calculatorResult.contractTotalView.month1TotalEur)}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {t.offres.calculatorFromMonth2Label}:{' '}
                                {formatEur(calculatorResult.contractTotalView.fromMonth2TotalEur)}
                                {t.offres.calculatorPerMonthSuffix}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Light breakdown */}
                        <div className="space-y-2 rounded-xl border border-slate-200 bg-white/60 p-4 dark:border-slate-700/70 dark:bg-slate-800/30">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {t.offres.calculatorBaseMediaLabel}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {formatEur(calculatorResult.monthlyView.month1BaseMediaEur)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {t.offres.calculatorAddonsSubtotalLabel}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {formatEur(calculatorResult.monthlyView.fromMonth2RecurringAddonsEur)}
                              {t.offres.calculatorPerMonthSuffix}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {t.offres.calculatorOneTimeFeesLabel}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {formatEur(calculatorResult.monthlyView.month1OneTimeFeesEur)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {t.offres.calculatorMonth1TotalLabel}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {formatEur(calculatorResult.monthlyView.month1TotalEur)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {t.offres.calculatorRecurringTotalLabel}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {formatEur(calculatorResult.monthlyView.fromMonth2TotalEur)}
                              {t.offres.calculatorPerMonthSuffix}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                      {t.offres.simDisclaimer}
                    </p>

                    <a
                      href="#contact"
                      className={`mt-5 block w-full rounded-lg bg-gradient-to-b from-sky-500 to-sky-600 py-2.5 text-center text-sm font-medium text-white transition-colors duration-150 ease-out hover:from-sky-600 hover:to-sky-700 active:from-sky-600 active:to-sky-700 dark:bg-gradient-to-b dark:from-sky-500 dark:to-sky-400 dark:hover:from-sky-500 dark:hover:to-sky-300 dark:active:from-sky-500 dark:active:to-sky-600 ${focusRing}`}
                    >
                      {t.offres.ctaEstimation}
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
