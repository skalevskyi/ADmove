'use client';

import { motion } from 'framer-motion';

// Legacy / unused component.
// This block contains hardcoded BASIC / PRO / EXCLUSIVE estimation content.
// It must not be reintroduced into the landing page without explicit SPEC approval.
export function VisibilitySection() {
  return (
    <section
      id="visibility"
      className="py-16"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <motion.h2
          className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
        >
          Comment nous estimons la visibilité
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-slate-600 dark:text-slate-300"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Le véhicule suit un parcours fixe. Les contacts sont estimés à partir du trafic en mouvement, des temps de stationnement et des créneaux à forte affluence. Les chiffres sont indicatifs et servent de base à la communication commerciale.
        </motion.p>
        <motion.div
          className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Synthèse des contacts (estimations)
          </h3>
          <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
            <li><strong>BASIC</strong> — ~5 000 / jour, ~110 000 / mois</li>
            <li><strong>PRO</strong> — ~7 000 / jour, ~150 000 / mois</li>
            <li><strong>EXCLUSIVE</strong> — ~9 000 / jour, ~200 000 / mois</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
