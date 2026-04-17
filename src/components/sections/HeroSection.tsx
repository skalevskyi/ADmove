'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BASE_PATH } from '@/lib/base-path';
import { ctaShapeBase } from '@/lib/cta-shape';

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
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

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
            className="max-w-3xl break-words text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white md:col-start-1 md:row-start-1 md:text-6xl"
            {...motionOpts}
          >
            {t.hero.headline}
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
            {t.hero.scale}
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

          {t.hero.scaleSupporting ? (
            <motion.p
              className="max-w-2xl break-words text-xs leading-relaxed text-slate-500 dark:text-slate-400 md:col-start-1 md:row-start-5"
              initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.11 }}
            >
              {t.hero.scaleSupporting}
            </motion.p>
          ) : null}
          <motion.p
            className={`max-w-2xl break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:col-start-1 ${
              t.hero.scaleSupporting ? 'md:row-start-6' : 'md:row-start-5'
            }`}
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.12 }}
          >
            {t.hero.trust}
          </motion.p>

          {/* Premium visual area: after primary CTA + supporting copy; desktop: col 2 */}
          <motion.div
            className={`relative max-md:-mt-2 max-md:-mb-2 md:col-start-2 md:row-start-1 md:self-center ${
              t.hero.scaleSupporting ? 'md:row-span-6' : 'md:row-span-5'
            }`}
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : 0.06 }}
          >
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
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
                  className={`rounded-full transition-colors duration-150 ease-out ${focusRing} ${
                    currentImageIndex === i
                      ? 'h-2 w-6 bg-slate-600 dark:bg-slate-200'
                      : 'h-2 w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 active:bg-slate-500 dark:hover:bg-slate-500 dark:active:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className={`md:col-start-1 md:hidden ${
              t.hero.scaleSupporting ? 'md:row-start-7' : 'md:row-start-6'
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
