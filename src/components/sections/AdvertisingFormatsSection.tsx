'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import { BASE_PATH } from '@/lib/base-path';

const FORMATS = [
  {
    id: 'basic',
    name: 'BASIC',
    description: 'Publicité face arrière',
    daily: '~5 000',
    monthly: '~110 000',
    price: '250 €',
    priceLabel: '250 € / mois',
    image: `${BASE_PATH}/vehicle/rear.png`,
    alt: 'Format BASIC — publicité arrière sur véhicule ADMOVE',
    featured: false,
    badge: null,
  },
  {
    id: 'pro',
    name: 'PRO',
    description: 'Publicité sur les flancs',
    daily: '~7 000',
    monthly: '~150 000',
    price: '450 €',
    priceLabel: '450 € / mois',
    image: `${BASE_PATH}/vehicle/side.png`,
    alt: 'Format PRO — publicité latérale sur véhicule ADMOVE',
    featured: false,
    badge: null,
  },
  {
    id: 'exclusive',
    name: 'EXCLUSIVE',
    description: 'Habillage complet du véhicule',
    daily: '~9 000',
    monthly: '~200 000',
    price: '750 €',
    priceLabel: '750 € / mois',
    image: `${BASE_PATH}/vehicle/full.png`,
    alt: 'Format EXCLUSIVE — habillage complet du véhicule ADMOVE',
    featured: true,
    badge: 'Visibilité maximale',
  },
] as const;

export function AdvertisingFormatsSection() {
  return (
    <section
      id="formats"
      className="border-t border-slate-200 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-900/30"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.h2
          className="text-center text-3xl font-bold text-slate-900 dark:text-white md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
        >
          Trois formats pour tous les budgets
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-center text-slate-600 dark:text-slate-300"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          BASIC, PRO ou EXCLUSIVE : choisissez la surface et la visibilité adaptées à votre objectif.
        </motion.p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FORMATS.map((format, i) => (
            <motion.article
              key={format.id}
              className={`flex flex-col rounded-xl border bg-white dark:bg-slate-800/50 ${
                format.featured
                  ? 'border-slate-300 ring-1 ring-slate-200/60 dark:border-slate-600 dark:ring-slate-500/20'
                  : 'border-slate-200 dark:border-slate-700'
              } transition-shadow hover:shadow-md dark:hover:shadow-none`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {/* Top row: name + optional badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-6 pb-0">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {format.name}
                </h3>
                {format.badge && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {format.badge}
                  </span>
                )}
              </div>

              {/* Image block */}
              <div className="relative h-44 w-full flex items-center justify-center px-6 py-4">
                <Image
                  src={format.image}
                  alt={format.alt}
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>

              {/* Description */}
              <p className="px-6 text-sm text-slate-600 dark:text-slate-300">
                {format.description}
              </p>

              {/* Stats */}
              <dl className="mt-3 space-y-1 px-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Contacts / jour</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{format.daily}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Contacts / mois</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">{format.monthly}</dd>
                </div>
              </dl>

              {/* Price */}
              <p className="mt-4 px-6 text-2xl font-bold text-slate-900 dark:text-white">
                {format.priceLabel}
              </p>

              {/* CTA */}
              <div className="mt-6 flex-1 p-6 pt-0">
                <a
                  href="#contact"
                  className="block w-full rounded-lg bg-slate-900 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-sky-600 dark:hover:bg-sky-500 dark:focus:ring-offset-slate-800"
                >
                  Demander un devis
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
