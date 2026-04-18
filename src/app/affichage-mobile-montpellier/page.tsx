import type { Metadata } from 'next';

import { SeoAffichageMobileContent } from '@/components/seo/SeoAffichageMobileContent';

export const metadata: Metadata = {
  title: 'Affichage mobile à Montpellier',
  description:
    'Découvrez une solution d’affichage mobile à Montpellier avec un véhicule en circulation sur un trajet réel. Visibilité locale simple et efficace.',
  alternates: {
    canonical: '/affichage-mobile-montpellier',
  },
};

export default function AffichageMobileMontpellierPage() {
  return <SeoAffichageMobileContent />;
}
