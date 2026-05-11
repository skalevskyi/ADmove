import { getPublicSiteUrl } from '@/lib/site-url';

/**
 * Minimal truthful Organization JSON-LD for the public marketing site.
 */
export function OrganizationJsonLd() {
  const url = getPublicSiteUrl();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SPM — Skalevskyi',
    alternateName: 'Skalevskyi publicité mobile',
    url,
    description:
      'Visibilité locale régulière entre Montpellier et le littoral : présence mobile sur un trajet réel quotidien, pour une exposition physique répétée sur le même corridor.',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Montpellier et littoral occitan',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
