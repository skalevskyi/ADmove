'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PackageId } from '@/lib/calculator/types';

import { OffreLightbox } from './OffreLightbox';

const focusRing =
  'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/70 dark:focus-visible:ring-slate-500/70';

type OffreImageCarouselProps = {
  packageId: PackageId;
  images: readonly string[];
  alt: string;
  imageCarouselLabel: string;
  imageCarouselImage: string;
  openGallery: string;
  lightboxClose: string;
};

export function OffreImageCarousel({
  packageId,
  images,
  alt,
  imageCarouselLabel,
  imageCarouselImage,
  openGallery,
  lightboxClose,
}: OffreImageCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const previewSrc = images[0];

  const handleOpenLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  const handleLightboxClose = useCallback((_finalIndex: number) => {
    setLightboxOpen(false);
  }, []);

  return (
    <>
      <div className="mt-6">
        <button
          ref={openerRef}
          type="button"
          onClick={handleOpenLightbox}
          aria-label={openGallery}
          className={`group relative block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 px-4 text-left dark:border-slate-600/80 dark:bg-slate-700/35 ${focusRing}`}
        >
          <div className="relative h-40 w-full">
            <motion.div
              className="relative h-full w-full"
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Image
                src={previewSrc}
                alt={alt}
                fill
                className="object-contain object-center"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </motion.div>
          </div>
        </button>
      </div>

      <OffreLightbox
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        packageId={packageId}
        images={images}
        initialIndex={0}
        alt={alt}
        openerRef={openerRef}
        labelClose={lightboxClose}
        imageCarouselLabel={imageCarouselLabel}
        imageCarouselImage={imageCarouselImage}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
