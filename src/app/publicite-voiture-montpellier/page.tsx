import type { Metadata } from 'next';

import { SeoPubliciteVoitureContent } from './SeoPubliciteVoitureContent';

export const metadata: Metadata = {
  title: 'Publicité sur voiture à Montpellier',
  description:
    'Découvrez une solution simple de publicité sur voiture à Montpellier avec un véhicule déjà en circulation. Visibilité locale réelle, sans marquage.',
  alternates: {
    canonical: '/publicite-voiture-montpellier',
  },
};

export default function PubliciteVoitureMontpellierPage() {
  return <SeoPubliciteVoitureContent />;
}
