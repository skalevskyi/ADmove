/**
 * EN — Parcours section. B2B advertising exposure; right column: dynamic title + description, static bullets + note.
 */

export const parcours = {
  title: 'A real route, seen every day',
  subtitle: 'The same route, the same traffic, every day.',
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
      bullet2: 'Repeated views from an active local audience',
      bullet3: 'Visible presence in circulation and stopping areas',
    },
    perols: {
      description:
        'Outbound to the coast: regular pass-by moments and recurring visibility in everyday flows.',
      tag: 'Outbound corridor',
      icon: 'district',
      bullet1: 'Visibility in pass-by moments toward the coast',
      bullet2: 'Repeated views during recurring weekday flows',
      bullet3: 'Good visibility near traffic and stop areas',
    },
    portMarianne: {
      description:
        'Active district: frequent pass-by moments and visibility during stops.',
      tag: 'Active district',
      icon: 'district',
      bullet1: 'Visibility in a district with strong local activity',
      bullet2: 'Frequent views from a regular urban audience',
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
      bullet2: 'Repeated views from local and passing audiences',
      bullet3: 'Good visibility in stop and parking areas',
    },
    grandeMotte: {
      description:
        'Dense coastal sector: stronger visibility through consistent circulation.',
      tag: 'Busy zone',
      icon: 'coast',
      bullet1: 'Visibility in a lively coastal area',
      bullet2: 'Regular views from a mobile local audience',
      bullet3: 'Stronger presence in circulation and parking zones',
    },
  },
  sharedBullets: {
    bullet1: 'Direct exposure in daily traffic (drivers and pedestrians)',
    bullet2: 'Repeated views from a stable local audience',
    bullet3: 'High visibility during stops and parking',
    note: 'Indicative visibility based on local traffic flows.',
  },
  visibilityTitle: 'Local visibility estimate',
  visibilityIntro:
    'Based on the real route and daily traffic.',
  visibilityIntro2: '',
  visibilityBlockTitle: 'Local visibility estimate',
  visibilitySummary: 'Indicative examples by format',
  visibilityMetricBasic: '60,000 – 100,000',
  visibilityMetricPro: '100,000 – 150,000',
  visibilityMetricExclusive: '130,000 – 200,000',
  visibilityContactsUnit: 'local views / month',
  visibilityCardBasicTitle: 'BASIC',
  visibilityCardBasicPlacement: 'rear',
  visibilityCardProTitle: 'PRO',
  visibilityCardProPlacement: 'side panels',
  visibilityCardExclusiveTitle: 'EXCLUSIVE',
  visibilityCardExclusivePlacement: 'full vehicle wrap',
  visibilityCaption:
    'Estimate based on the real route and daily traffic',
  visibilityIndicative: '· indicative visibility',
} as const;
