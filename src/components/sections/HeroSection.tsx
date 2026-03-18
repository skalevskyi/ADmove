'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BASE_PATH } from '@/lib/base-path';

const HERO_IMAGES = [
  `${BASE_PATH}/vehicle/hero-car-1.png`,
  `${BASE_PATH}/vehicle/hero-car-2.png`,
  `${BASE_PATH}/vehicle/hero-car-3.png`,
] as const;

const CAROUSEL_INTERVAL_MS = 5000;

/** Schematic route hint: line + points only (not a map). */
function RouteHint() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07] dark:opacity-[0.12]"
      aria-hidden
    >
      <svg
        viewBox="0 0 200 80"
        className="h-full max-h-32 w-full max-w-[280px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path
          d="M 10 40 Q 50 20, 100 40 T 190 40"
          className="text-slate-600 dark:text-slate-400"
        />
        {[10, 50, 100, 150, 190].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={40}
            r={i === 0 || i === 4 ? 4 : 3}
            className="fill-slate-500 dark:fill-slate-400"
          />
        ))}
      </svg>
    </div>
  );
}

const focusRing =
  'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900';

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const motionOpts = {
    initial: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.4 },
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-4 py-20 md:px-6 md:py-24"
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
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20 lg:items-center">
          {/* Copy */}
          <div className="flex flex-col justify-center space-y-6">
            <motion.h1
              className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl leading-tight"
              {...motionOpts}
            >
              {t.hero.headline}
            </motion.h1>
            <motion.p
              className="max-w-2xl text-lg text-slate-600 dark:text-slate-300"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.08 }}
            >
              {t.hero.subheadline}
            </motion.p>
            <motion.p
              className="text-2xl font-semibold text-slate-900 dark:text-white"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.1 }}
            >
              {t.hero.scale}
            </motion.p>
            <motion.p
              className="text-sm text-slate-500 dark:text-slate-400"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.12 }}
            >
              {t.hero.route}
            </motion.p>
            <motion.p
              className="text-sm text-slate-600 dark:text-slate-300"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.14 }}
            >
              {t.hero.trust}
            </motion.p>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.16 }}
            >
              <a
                href="#contact"
                className={`inline-block min-w-0 flex-1 rounded-lg bg-slate-900 px-6 py-3 text-center text-base font-medium text-white transition hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 ${focusRing}`}
              >
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#parcours"
                className={`inline-block min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-6 py-3 text-center text-base font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 ${focusRing}`}
              >
                {t.hero.ctaSecondary}
              </a>
            </motion.div>
          </div>

          {/* Premium visual area: vehicle + schematic route hint */}
          <motion.div
            className="relative"
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.06 }}
          >
            <div className="relative aspect-[4/3] w-full max-w-xl mx-auto">
              <RouteHint />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  className="absolute inset-0"
                  initial={{
                    opacity: reducedMotion ? 1 : 0,
                    scale: reducedMotion ? 1 : 0.985,
                  }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: reducedMotion ? 1 : 0,
                    scale: reducedMotion ? 1 : 0.99,
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.45 }}
                >
                  <Image
                    src={HERO_IMAGES[currentImageIndex]}
                    alt={t.hero.imageAlt}
                    fill
                    className="object-contain"
                    priority={currentImageIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div
              className="mt-4 flex items-center justify-center gap-2"
              role="tablist"
              aria-label={t.hero.carouselLabel}
            >
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-label={`${t.hero.carouselImage} ${i + 1}`}
                  aria-selected={currentImageIndex === i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`rounded-full transition-all duration-300 ${focusRing} ${
                    currentImageIndex === i
                      ? 'h-2 w-6 bg-slate-600 dark:bg-slate-200'
                      : 'h-2 w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
