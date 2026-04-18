import type { Metadata } from 'next';

import { SeoPubliciteLocaleContent } from '@/components/seo/SeoPubliciteLocaleContent';

export const metadata: Metadata = {
  title: 'Publicité locale à Montpellier',
  description:
    'Augmentez la visibilité locale de votre entreprise à Montpellier grâce à une présence quotidienne sur un trajet réel.',
  alternates: {
    canonical: '/publicite-locale-montpellier',
  },
};

export default function PubliciteLocaleMontpellierPage() {
  return <SeoPubliciteLocaleContent />;
}
