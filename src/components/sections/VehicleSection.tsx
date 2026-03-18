'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Car, MapPin, MousePointerClick, Repeat, Route, Sun } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ROUTE_IDS = [
  'montpellier',
  'portMarianne',
  'carnon',
  'palavas',
  'grandeMotte',
] as const;

const ROUTE_AUTOPLAY_MS = 5000;
const PAUSE_AFTER_CLICK_MS = 5500;

/** Parses "PACKAGE (placement) — metrics" into parts for metric row + legend. */
function parseVisibilityRow(
  raw: string,
): { package: string; placement: string; metrics: string } | null {
  const dashMatch = /^(.+?)\s*—\s*(.+)$/.exec(raw.trim());
  if (!dashMatch) return null;
  const [, left, right] = dashMatch;
  const parenMatch = /^(.+?)\s*\((.+?)\)\s*$/.exec(left.trim());
  const pkg = parenMatch ? parenMatch[1].trim() : left.trim();
  const placement = parenMatch ? parenMatch[2].trim() : '';
  // Replace only the separator comma between daily/monthly metrics (`, ~...`),
  // not thousand separators like `5,000/day`.
  const metrics = right.replace(/,\s*(?=~)/g, ' · ').trim();
  return { package: pkg, placement, metrics };
}

export function VehicleSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState<number | null>(null);
  const directionRef = useRef<1 | -1>(1);
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();

  const routePoints = ROUTE_IDS.map((id) => ({
    id,
    label: t.locations[id],
    descriptor: t.parcours.descriptors[id],
  }));
  const activeLocationId = ROUTE_IDS[activeIndex];
  const activeContent = t.parcours.locationContent[activeLocationId];

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      const now = Date.now();
      if (pausedUntil !== null && now < pausedUntil) return;
      if (pausedUntil !== null && now >= pausedUntil) setPausedUntil(null);
      setActiveIndex((prev) => {
        const d = directionRef.current;
        const next = prev + d;
        if (next >= routePoints.length) {
          directionRef.current = -1;
          return routePoints.length - 2;
        }
        if (next < 0) {
          directionRef.current = 1;
          return 1;
        }
        return next;
      });
    }, ROUTE_AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [pausedUntil, reducedMotion]);

  const handleMarkerClick = (index: number) => {
    setActiveIndex(index);
    setPausedUntil(Date.now() + PAUSE_AFTER_CLICK_MS);
  };

  return (
    <section id="parcours" className="py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Shared section header */}
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
            {t.parcours.title}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 md:text-base">
            {t.parcours.subtitle}
          </p>
        </header>

        <div className="grid gap-12 md:grid-cols-[0.35fr_0.65fr] md:items-start">
          {/* Left: route block — content-sized on mobile (w-fit) so it centers; full-width in column on desktop */}
          <motion.div
            className="flex justify-center self-center md:flex md:items-center md:justify-center"
            initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
          >
            <div className="w-fit flex flex-col mx-auto md:w-full md:max-w-xs">
              {routePoints.map((point, i) => {
                const isActive = activeIndex === i;
                const isFilled = i < activeIndex;
                const isSegmentFilled =
                  i < routePoints.length - 1 && i < activeIndex;
                return (
                  <div key={point.id} className="flex items-start gap-2.5 py-1">
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => handleMarkerClick(i)}
                        aria-label={`${point.label} — ${point.descriptor}`}
                        aria-current={isActive ? 'true' : undefined}
                        className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                          isActive
                            ? 'ring-2 ring-sky-500/60 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 dark:ring-sky-400/50'
                            : ''
                        }`}
                      >
                        <span
                          className={`block rounded-full transition-all duration-300 ${
                            isActive
                              ? 'h-2.5 w-2.5 bg-slate-700 dark:bg-slate-200'
                              : isFilled
                                ? 'h-2 w-2 bg-sky-500 dark:bg-sky-400'
                                : 'h-1.5 w-1.5 border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900 hover:scale-[1.05] hover:border-slate-400 dark:hover:border-slate-500'
                          }`}
                        />
                      </button>
                      {i < routePoints.length - 1 && (
                        <div
                          className={`mx-auto mt-1.5 h-4 w-px flex-shrink-0 transition-colors duration-300 ${
                            isSegmentFilled
                              ? 'bg-slate-500 dark:bg-slate-400'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                          aria-hidden
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMarkerClick(i)}
                      className="text-left focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 rounded px-1 -ml-1 transition-all duration-300"
                    >
                      <span
                        className={`block text-sm leading-tight ${
                          isActive
                            ? 'font-semibold text-slate-800 dark:text-white'
                            : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {point.label}
                      </span>
                      <span
                        className={`mt-px block text-xs text-slate-500 dark:text-slate-400 leading-tight ${
                          !isActive ? 'invisible' : ''
                        }`}
                      >
                        {point.descriptor}
                      </span>
                    </button>
                  </div>
                );
              })}

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <MousePointerClick className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" strokeWidth={1.5} aria-hidden />
                <span className="whitespace-nowrap">{t.parcours.timelineHint}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: dynamic title + description, then static bullets + note */}
          <div className="flex max-w-xl flex-col space-y-5">
            <div className="min-h-[108px] md:min-h-[124px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLocationId}
                  className="flex flex-col gap-3"
                  initial={{ opacity: reducedMotion ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: reducedMotion ? 1 : 0 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.2,
                    ease: 'easeOut',
                  }}
                >
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {routePoints[activeIndex].label}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 leading-tight">
                    {activeContent.icon === 'route' ? (
                      <Route className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    ) : activeContent.icon === 'coast' ? (
                      <Sun className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    ) : (
                      <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                    )}
                    <span>{activeContent.tag}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">
                    {activeContent.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex gap-3 items-start">
                <Car
                  className="mt-0.5 h-5 w-5 shrink-0 stroke-[2] text-sky-600 dark:text-sky-400"
                  aria-hidden
                />
                <span className="leading-snug">{activeContent.bullet1}</span>
              </li>
              <li className="flex gap-3 items-start">
                <Repeat
                  className="mt-0.5 h-5 w-5 shrink-0 stroke-[2] text-sky-600 dark:text-sky-400"
                  aria-hidden
                />
                <span className="leading-snug">{activeContent.bullet2}</span>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 stroke-[2] text-sky-600 dark:text-sky-400"
                  aria-hidden
                />
                <span className="leading-snug">{activeContent.bullet3}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Visibility storytelling — part of Parcours, not a separate nav item */}
        <div className="mx-auto mt-12 max-w-4xl border-t border-slate-200/80 pt-6 dark:border-slate-700/80">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t.parcours.visibilityBlockTitle}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:text-base">
            {t.parcours.visibilityIntro}
          </p>
          {t.parcours.visibilityIntro2 ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:text-base">
              {t.parcours.visibilityIntro2}
            </p>
          ) : null}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/90 px-6 py-6 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.parcours.visibilitySummary}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {(
                [
                  t.parcours.visibilityRear,
                  t.parcours.visibilitySide,
                  t.parcours.visibilityFull,
                ] as const
              ).map((raw) => {
                const parsed = parseVisibilityRow(raw);
                if (!parsed) return null;
                const metricParts = parsed.metrics.split(' · ').map((p) => p.trim());
                const dailyPart = metricParts[0] ?? parsed.metrics;
                const monthlyPart = metricParts[1] ?? parsed.metrics;

                return (
                  <div
                    key={parsed.package}
                    className="rounded-xl border border-slate-200/80 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-900/20"
                  >
                    <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                      {parsed.package}
                    </p>
                    {parsed.placement ? (
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {parsed.placement}
                      </p>
                    ) : null}

                    <div className="mt-3">
                      <p className="text-xl font-bold leading-tight text-slate-900 dark:text-white">
                        {monthlyPart}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {dailyPart}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
