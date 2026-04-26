'use client';

import Link from 'next/link';
import { ArrowLeft, CalendarDays, Clock3, MapPinned, Repeat, Route, Ruler, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { withBasePath } from '@/lib/base-path';
import { TrajetsMap } from '@/components/trajets/TrajetsMap';
import type { TrajetsRouteId } from '@/components/trajets/data/trajets-routes';

export function TrajetsClient() {
  const { t } = useLanguage();
  const routeDays = t.trajets.days;
  const [activeIndex, setActiveIndex] = useState(3);
  const activeDay = routeDays[activeIndex];
  const activeRouteId = activeDay.id as TrajetsRouteId;
  const summaryCards = [
    { label: t.trajets.summary.distanceLabel, value: t.trajets.summary.distanceValue },
    { label: t.trajets.summary.timeLabel, value: t.trajets.summary.timeValue },
    { label: t.trajets.summary.daysLabel, value: t.trajets.summary.daysValue },
    { label: t.trajets.summary.routeLabel, value: t.trajets.summary.routeValue },
  ];
  const surfaceElevation =
    'shadow-[0_14px_34px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_38px_rgba(0,0,0,0.24)]';
  const activeDayElevation =
    'shadow-[0_8px_18px_rgba(14,165,233,0.12)] dark:shadow-[0_10px_22px_rgba(14,165,233,0.16)]';

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <header>
        <div>
          <Link
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span>{t.trajets.backHome}</span>
          </Link>
        </div>

        <div className="mt-4 inline-flex items-center rounded-full border border-sky-200/70 bg-sky-50/60 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-300">
          {t.trajets.badge}
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl">
          {t.trajets.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
          {t.trajets.intro}
        </p>
      </header>

      <section className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className={`rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-800/60 ${surfaceElevation}`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <aside
          className={`order-1 rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-700/80 dark:bg-slate-800/50 lg:order-2 ${surfaceElevation}`}
        >
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {t.trajets.selector.title}
          </h2>
          <div className="mt-3 md:hidden">
            <div className="no-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
              {t.trajets.selector.weekdaysShort.map((weekday, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={routeDays[index]?.id ?? `${weekday}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'border-sky-300 bg-sky-50/40 text-sky-700 dark:border-sky-500/60 dark:bg-sky-950/20 dark:text-sky-300'
                        : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {weekday}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 hidden space-y-2 md:block">
            {routeDays.map((day, index) => {
              const isActive = index === activeIndex;
              const isRecorded = day.isRecorded;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? `border-sky-300 bg-sky-50/40 dark:border-sky-500/60 dark:bg-sky-950/20 ${activeDayElevation}`
                      : isRecorded
                        ? 'border-slate-200/80 bg-white hover:border-sky-200 hover:bg-sky-50/30 dark:border-slate-700/80 dark:bg-slate-800/40 dark:hover:border-sky-500/40 dark:hover:bg-sky-950/20'
                        : 'border-slate-200/70 bg-white/60 text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-800/25 dark:text-slate-500 dark:hover:border-slate-600 dark:hover:bg-slate-800/35'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{day.weekday}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{day.route}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="order-2 space-y-6 lg:order-1">
          <article
            className={`rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-slate-800/60 ${surfaceElevation}`}
          >
            <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" aria-hidden />
              {t.trajets.map.description}
            </p>

            <div className="mt-5 h-72 rounded-xl border border-slate-200 bg-white p-2 md:h-[18.25rem] md:p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <TrajetsMap activeRouteId={activeRouteId} fallbackText={t.trajets.map.fallback} />
            </div>
          </article>

          <article
            className={`rounded-xl border border-slate-200 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-800/60 ${surfaceElevation}`}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[8rem_minmax(10rem,1fr)_minmax(7rem,1fr)_max-content] md:items-start md:gap-6">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-4 w-4 text-sky-500" aria-hidden />
                  {t.trajets.detail.dateLabel}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{activeDay.weekday}</p>
              </div>

              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Route className="h-4 w-4 text-sky-500" aria-hidden />
                  {t.trajets.detail.routeLabel}
                </p>
                <div className="mt-1.5">
                  {activeDay.isRecorded ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500 dark:bg-slate-400" />
                        <span className="text-sm font-medium leading-tight text-slate-900 dark:text-white">
                          {activeDay.routeStart}
                        </span>
                      </div>
                      <div className="ml-[3px] h-2.5 w-px bg-slate-300 dark:bg-slate-600" />
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500 dark:bg-slate-400" />
                        <span className="text-sm font-medium leading-tight text-slate-900 dark:text-white">
                          {activeDay.routeEnd}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-medium leading-tight text-slate-500 dark:text-slate-400">
                      {activeDay.routeStart}
                    </p>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Clock3 className="h-4 w-4 text-sky-500" aria-hidden />
                  {t.trajets.detail.timeLabel}
                </p>
                <div className="mt-1.5 text-sm">
                  {'timeSlots' in activeDay ? (
                    <>
                      <p className="whitespace-nowrap leading-tight">
                        <span className="text-slate-500 dark:text-slate-400">
                          {activeDay.timeSlots[0].label}
                        </span>{' '}
                        <span className="font-medium text-slate-900 dark:text-white">
                          {activeDay.timeSlots[0].value}
                        </span>
                      </p>
                      <div className="h-2.5" />
                      <p className="whitespace-nowrap leading-tight">
                        <span className="text-slate-500 dark:text-slate-400">
                          {activeDay.timeSlots[1].label}
                        </span>{' '}
                        <span className="font-medium text-slate-900 dark:text-white">
                          {activeDay.timeSlots[1].value}
                        </span>
                      </p>
                    </>
                  ) : activeDay.isRecorded ? (
                    <>
                      <p className="font-medium leading-tight text-slate-900 dark:text-white">
                        {activeDay.timeStart}
                      </p>
                      <p className="font-medium leading-tight text-slate-900 dark:text-white">
                        — {activeDay.timeEnd}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium leading-tight text-slate-500 dark:text-slate-400">
                      {activeDay.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="min-w-0 md:justify-self-end">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <Ruler className="h-4 w-4 text-sky-500" aria-hidden />
                  {t.trajets.detail.metricsLabel}
                </p>
                <div className="mt-1 grid grid-cols-2 gap-1.5 md:w-[10.5rem]">
                  <div className="inline-flex h-6 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-slate-200/80 bg-slate-50/80 px-2 text-[11px] font-medium text-slate-700 dark:border-slate-700/80 dark:bg-slate-900/40 dark:text-slate-200">
                    <Route className="h-3.5 w-3.5 text-sky-500" aria-hidden />
                    <span>{activeDay.distance}</span>
                  </div>
                  <div className="inline-flex h-6 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-slate-200/80 bg-slate-50/80 px-2 text-[11px] font-medium text-slate-700 dark:border-slate-700/80 dark:bg-slate-900/40 dark:text-slate-200">
                    <Repeat className="h-3.5 w-3.5 text-sky-500" aria-hidden />
                    <span>{activeDay.passages}</span>
                  </div>
                  <div className="inline-flex h-6 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-slate-200/80 bg-slate-50/80 px-2 text-[11px] font-medium text-slate-700 dark:border-slate-700/80 dark:bg-slate-900/40 dark:text-slate-200">
                    <Clock3 className="h-3.5 w-3.5 text-sky-500" aria-hidden />
                    <span>{activeDay.duration}</span>
                  </div>
                  <div className="inline-flex h-6 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-slate-200/80 bg-slate-50/80 px-2 text-[11px] font-medium text-slate-700 dark:border-slate-700/80 dark:bg-slate-900/40 dark:text-slate-200">
                    <MapPinned className="h-3.5 w-3.5 text-sky-500" aria-hidden />
                    <span>{activeDay.gpsPoints}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        className={`mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50 ${surfaceElevation}`}
      >
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" aria-hidden />
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.trajets.trust}</p>
        </div>
      </section>
    </div>
  );
}
