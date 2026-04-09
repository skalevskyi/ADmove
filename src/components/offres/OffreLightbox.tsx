'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';

import type { PackageId } from '@/lib/calculator/types';

const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

const SWIPE_THRESHOLD_PX = 48;

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const ZOOM_STEP = 0.25;

/** Media stage height: single controlled viewport-relative cap (svh), plus absolute max in px. */
const MEDIA_STAGE_HEIGHT = 'min(560px, 60svh)';

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Soft radial stage: center open/readable, edges slightly deeper — same logic in light/dark,
 * tuned per theme (atmospheric, not a flat block).
 */
const stageSurfaceClass =
  'relative select-none rounded-xl p-2 sm:p-3 ' +
  'bg-[radial-gradient(ellipse_80%_76%_at_50%_51%,rgb(255_255_255)_0%,rgb(248_250_252)_32%,rgb(226_232_240)_100%)] ' +
  'dark:bg-[radial-gradient(ellipse_80%_76%_at_50%_50%,rgb(71_85_105/0.42)_0%,rgb(51_65_85/0.32)_44%,rgb(15_23_42)_100%)]';

type OffreLightboxProps = {
  isOpen: boolean;
  onClose: (finalIndex: number) => void;
  packageId: PackageId;
  images: readonly string[];
  initialIndex: number;
  alt: string;
  openerRef: React.RefObject<HTMLButtonElement | null>;
  labelClose: string;
  imageCarouselLabel: string;
  imageCarouselImage: string;
  reducedMotion: boolean;
};

export function OffreLightbox({
  isOpen,
  onClose,
  packageId,
  images,
  initialIndex,
  alt,
  openerRef,
  labelClose,
  imageCarouselLabel,
  imageCarouselImage,
  reducedMotion,
}: OffreLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scaleRef = useRef(1);
  const translateXRef = useRef(0);
  const translateYRef = useRef(0);
  const imageClipContainerRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<HTMLDivElement>(null);

  /** Active pointers for pinch (two) and pan/swipe (one). */
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchOriginRef = useRef<{ dist: number; scale: number } | null>(null);
  const panRef = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null);
  const swipeStartXRef = useRef<number | null>(null);
  /** True if two pointers were active at least once in this gesture session (blocks swipe). */
  const pinchSessionRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    translateXRef.current = translateX;
  }, [translateX]);

  useEffect(() => {
    translateYRef.current = translateY;
  }, [translateY]);

  useEffect(() => {
    if (!isOpen) return;
    setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, [index]);

  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scale <= MIN_SCALE) {
      setTranslateX(0);
      setTranslateY(0);
    }
  }, [scale]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const handleClose = useCallback(() => {
    onClose(index);
    requestAnimationFrame(() => openerRef.current?.focus());
  }, [index, onClose, openerRef]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, handleClose, goPrev, goNext]);

  /** Lock body scroll without layout jump when scrollbar disappears. */
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarW > 0) {
      document.body.style.paddingRight = `${scrollbarW}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
  }, [isOpen]);

  const resetPointerSession = useCallback(() => {
    pointersRef.current.clear();
    pinchOriginRef.current = null;
    panRef.current = null;
    swipeStartXRef.current = null;
    pinchSessionRef.current = false;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const el = gestureRef.current;
    if (!el) return;

    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2) {
      pinchSessionRef.current = true;
      panRef.current = null;
      swipeStartXRef.current = null;
      const pts = [...pointersRef.current.values()];
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (d > 0) {
        pinchOriginRef.current = { dist: d, scale: scaleRef.current };
      }
      return;
    }

    if (scaleRef.current > MIN_SCALE) {
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        tx: translateXRef.current,
        ty: translateYRef.current,
      };
      el.setPointerCapture(e.pointerId);
    } else {
      swipeStartXRef.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2 && pinchOriginRef.current) {
      const pts = [...pointersRef.current.values()];
      if (pts.length < 2) return;
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const base = pinchOriginRef.current;
      if (base.dist <= 0) return;
      const next = clamp(base.scale * (d / base.dist), MIN_SCALE, MAX_SCALE);
      setScale(next);
      e.preventDefault();
      return;
    }

    if (
      pointersRef.current.size === 1 &&
      panRef.current &&
      scaleRef.current > MIN_SCALE &&
      !pinchOriginRef.current
    ) {
      const p = panRef.current;
      const clip = imageClipContainerRef.current;
      const cw = clip?.clientWidth ?? 0;
      const ch = clip?.clientHeight ?? 0;
      const s = scaleRef.current;
      let nx = p.tx + (e.clientX - p.startX);
      let ny = p.ty + (e.clientY - p.startY);
      const maxOffsetX = ((s - 1) * cw) / 2;
      const maxOffsetY = ((s - 1) * ch) / 2;
      nx = clamp(nx, -maxOffsetX, maxOffsetX);
      ny = clamp(ny, -maxOffsetY, maxOffsetY);
      setTranslateX(nx);
      setTranslateY(ny);
      e.preventDefault();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = gestureRef.current;
    if (el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }

    pointersRef.current.delete(e.pointerId);

    if (pointersRef.current.size < 2) {
      pinchOriginRef.current = null;
    }

    if (pointersRef.current.size === 0) {
      const startX = swipeStartXRef.current;
      if (
        !pinchSessionRef.current &&
        scaleRef.current <= MIN_SCALE &&
        startX !== null
      ) {
        const dx = e.clientX - startX;
        if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) {
          if (dx < 0) goNext();
          else goPrev();
        }
      }

      resetPointerSession();
      return;
    }

    if (pointersRef.current.size === 1) {
      if (scaleRef.current > MIN_SCALE) {
        const rem = [...pointersRef.current.entries()][0];
        if (rem) {
          panRef.current = {
            startX: rem[1].x,
            startY: rem[1].y,
            tx: translateXRef.current,
            ty: translateYRef.current,
          };
          gestureRef.current?.setPointerCapture(rem[0]);
        }
      } else {
        panRef.current = null;
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, s + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, s - ZOOM_STEP));
  }, []);

  const zoomButtonClass =
    `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 ` +
    `bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 ` +
    `dark:border-slate-600/90 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-700 ` +
    focusRing;

  /** Mobile-only zoom controls when a multi-image tablist is shown on all breakpoints. */
  const zoomButtonClassMobileOnly = `${zoomButtonClass} md:hidden`;

  if (!mounted || typeof document === 'undefined') return null;

  const showBottomChrome = images.length > 1;

  const mediaStageStyle = { height: MEDIA_STAGE_HEIGHT } as React.CSSProperties;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="offre-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
          initial={{ opacity: reducedMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reducedMotion ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/[0.22] backdrop-blur-md dark:bg-black/[0.26]"
            aria-hidden
            onClick={handleClose}
          />
          <div
            className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain"
            style={{
              paddingTop: 'max(1.5rem, env(safe-area-inset-top, 0px))',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
              <div className="pointer-events-auto w-full max-w-4xl shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/[0.08] ring-1 ring-slate-900/[0.04] dark:border-slate-600/50 dark:bg-slate-900 dark:shadow-xl dark:shadow-black/25 dark:ring-white/[0.06]">
              <header className="mb-3 flex w-full items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-600/55">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-800 dark:text-slate-300">
                  {packageId}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label={labelClose}
                  onClick={handleClose}
                  title={labelClose}
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600/90 dark:bg-slate-800 dark:text-slate-100 dark:shadow-none dark:hover:border-slate-500 dark:hover:bg-slate-700 dark:hover:text-white ${focusRing}`}
                >
                  <X className="h-4 w-4 opacity-90" strokeWidth={2} aria-hidden />
                </button>
              </header>

              <div className={stageSurfaceClass}>
                <div
                  ref={gestureRef}
                  className="touch-none"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerCancel}
                >
                  <div
                    ref={imageClipContainerRef}
                    className="relative mx-auto w-full max-w-full overflow-hidden"
                    style={mediaStageStyle}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={index}
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: reducedMotion ? 1 : 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: reducedMotion ? 1 : 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.28 }}
                      >
                        <div className="relative h-full w-full">
                          <div
                            className="flex h-full w-full items-center justify-center will-change-transform"
                            style={{
                              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                              transformOrigin: 'center center',
                            }}
                          >
                            <div className="relative h-full w-full">
                              <Image
                                src={images[index]}
                                alt={alt}
                                fill
                                className="object-contain"
                                sizes="(max-width: 896px) 100vw, 896px"
                                priority
                                draggable={false}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {showBottomChrome ? (
                <div
                  className="mt-4 flex min-h-[44px] items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-600/50"
                >
                  <button
                    type="button"
                    className={zoomButtonClassMobileOnly}
                    aria-label="Zoom out"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomOut();
                    }}
                  >
                    <Minus className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </button>
                  <div
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-3"
                    role="tablist"
                    aria-label={imageCarouselLabel}
                  >
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-label={`${imageCarouselImage} ${i + 1}`}
                        aria-selected={index === i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIndex(i);
                        }}
                        className={`flex min-h-11 min-w-11 items-center justify-center rounded-full transition-all duration-200 ease-out ${focusRing}`}
                      >
                        <span
                          className={`block rounded-full transition-all duration-200 ease-out ${
                            index === i
                              ? 'h-3 w-10 bg-slate-800 shadow-sm dark:bg-slate-200 dark:shadow-black/25'
                              : 'h-3 w-3 bg-slate-400 hover:bg-slate-500 dark:bg-slate-500 dark:hover:bg-slate-400'
                          }`}
                          aria-hidden
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={zoomButtonClassMobileOnly}
                    aria-label="Zoom in"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomIn();
                    }}
                  >
                    <Plus className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </button>
                </div>
              ) : (
                <div
                  className="mt-4 flex min-h-[44px] items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-600/50 md:hidden"
                >
                  <button
                    type="button"
                    className={zoomButtonClass}
                    aria-label="Zoom out"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomOut();
                    }}
                  >
                    <Minus className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </button>
                  <div className="min-h-[44px] flex-1" aria-hidden />
                  <button
                    type="button"
                    className={zoomButtonClass}
                    aria-label="Zoom in"
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomIn();
                    }}
                  >
                    <Plus className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
