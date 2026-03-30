/**
 * EN — Parcours section. B2B advertising exposure; right column: dynamic title + description, static bullets + note.
 */

export const parcours = {
  title: 'Route & Visibility Zones',
  subtitle:
    'Daily presence on a route between Montpellier and La Grande-Motte, with regular passages via Pérols, Carnon, Palavas and Port Marianne.',
  timelineHint:
    'Click a route point to pause and view details.',
  descriptors: {
    montpellier: 'urban center',
    perols: 'outbound corridor',
    portMarianne: 'active district',
    carnon: 'coastal route',
    palavas: 'seafront',
    grandeMotte: 'busy area',
  },
  locationContent: {
    montpellier: {
      description:
        'A high-traffic urban center with daily circulation and steady visibility.',
      tag: 'Traffic hub',
      icon: 'city',
      bullet1: 'Visibility in daily urban traffic flows',
      bullet2: 'Repeated contact with an active local audience',
      bullet3: 'Visible presence in circulation and stopping areas',
    },
    perols: {
      description:
        'Outbound to the coast: regular pass-by moments and recurring visibility in everyday flows.',
      tag: 'Outbound corridor',
      icon: 'district',
      bullet1: 'Visibility in pass-by moments toward the coast',
      bullet2: 'Repeated contact during recurring weekday flows',
      bullet3: 'Good visibility near traffic and stop areas',
    },
    portMarianne: {
      description:
        'Active district: frequent pass-by moments and visibility during stops.',
      tag: 'Active district',
      icon: 'district',
      bullet1: 'Visibility in a district with strong local activity',
      bullet2: 'Frequent contact with a regular urban audience',
      bullet3: 'Stronger presence during slowdowns and stops',
    },
    carnon: {
      description:
        'Coastal axis: constant traffic and route repetition.',
      tag: 'Coastal route',
      icon: 'route',
      bullet1: 'Direct exposure on the route to the coast',
      bullet2: 'Repeated message visibility on a high-traffic route',
      bullet3: 'Higher visibility during slowdowns and parking',
    },
    palavas: {
      description:
        'Seaside area: exposure and daily repetition.',
      tag: 'Stop points',
      icon: 'stop',
      bullet1: 'Visible presence in traffic flows toward the seafront',
      bullet2: 'Repeated contact with local and passing audiences',
      bullet3: 'Good visibility in stop and parking areas',
    },
    grandeMotte: {
      description:
        'Dense coastal sector: stronger visibility through consistent circulation.',
      tag: 'Busy zone',
      icon: 'coast',
      bullet1: 'Visibility in a lively coastal area',
      bullet2: 'Regular contact with a mobile local audience',
      bullet3: 'Stronger presence in circulation and parking zones',
    },
  },
  sharedBullets: {
    bullet1: 'Direct exposure in daily traffic (drivers and pedestrians)',
    bullet2: 'Repeated contact with a stable local audience',
    bullet3: 'High visibility during stops and parking',
    note: 'Indicative visibility based on local traffic flows.',
  },
  visibilityTitle: 'Visibility estimation',
  visibilityIntro:
    'Estimates based on local traffic and daily repetition.',
  visibilityIntro2: '',
  visibilityBlockTitle: 'Visibility estimation on this route',
  visibilitySummary: 'Indicative examples by format',
  visibilityMetricBasic: '60,000 – 100,000',
  visibilityMetricPro: '100,000 – 150,000',
  visibilityMetricExclusive: '130,000 – 200,000',
  visibilityContactsUnit: 'contacts / month',
  visibilityCardBasicTitle: 'BASIC',
  visibilityCardBasicPlacement: 'rear',
  visibilityCardProTitle: 'PRO',
  visibilityCardProPlacement: 'side panels',
  visibilityCardExclusiveTitle: 'EXCLUSIVE',
  visibilityCardExclusivePlacement: 'full vehicle wrap',
  visibilityCaption:
    'Indicative estimate depending on format, route and traffic conditions',
  visibilityIndicative: '· indicative visibility',
} as const;
