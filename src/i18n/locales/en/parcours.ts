/**
 * EN — Parcours section. B2B advertising exposure; right column: dynamic title + description, static bullets + note.
 */

export const parcours = {
  title: 'A real route, seen every day',
  subtitle:
    'A real corridor between Montpellier and the littoral, driven daily in both directions.',
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
        'Dense urban core: strong exposure to everyday flows and a local anchor for the message at the start of the route.',
      tag: 'Traffic hub',
      icon: 'city',
      bullet1:
        'High passage density: the brand surfaces at the heart of local trips.',
      bullet2:
        'Frequent contacts with people living and working near the corridor.',
      bullet3:
        'Readable moments in queues, intersections, and stopping areas.',
    },
    perols: {
      description:
        'City-to-coast link: traffic gathers on this axis before reaching the sea.',
      tag: 'Outbound corridor',
      icon: 'district',
      bullet1:
        'Regular pass-through while the leg is still urban in character.',
      bullet2:
        'Steady presence as the route opens toward the littoral.',
      bullet3:
        'Clear read moments when traffic narrows onto the axis.',
    },
    portMarianne: {
      description:
        'High-activity district: daily mobility between workplaces, services, and residential areas.',
      tag: 'Active district',
      icon: 'district',
      bullet1:
        'Structured flows between business clusters and neighborhoods.',
      bullet2:
        'A recurring audience on short, repeated trips.',
      bullet3:
        'Visibility during queues and slowdown phases.',
    },
    carnon: {
      description:
        'Key coastal segment: sustained movement between urban flows and trips toward the shore.',
      tag: 'Coastal route',
      icon: 'route',
      bullet1:
        'Exposure on the stretch where the corridor continues toward the sea.',
      bullet2:
        'The same message encountered at different times on one path.',
      bullet3:
        'Stronger read at slowdowns and junctions.',
    },
    palavas: {
      description:
        'Approaching the seafront: slower traffic and longer windows to see the message.',
      tag: 'Stop points',
      icon: 'stop',
      bullet1:
        'Coastal traffic where vehicles stay longer in view.',
      bullet2:
        'The brand seen in flows toward or from the shore.',
      bullet3:
        'Readable moments near stops and parking.',
    },
    grandeMotte: {
      description:
        'Dense coastal hub near the end of the leg: strong exposure in a heavily used area.',
      tag: 'Busy zone',
      icon: 'coast',
      bullet1:
        'Exposure in a busy littoral hub with heavy vehicle movement.',
      bullet2:
        'Repeated encounters that build gradual recognition.',
      bullet3:
        'Sustained presence in approach and parking flows.',
    },
  },
  sharedBullets: {
    bullet1: 'Exposure in the route’s real-world traffic (drivers and pedestrians)',
    bullet2: 'Regular returns of the message for a local audience',
    bullet3: 'Favorable reading during stops and parking',
    note: 'Indicative visibility based on local traffic flows.',
  },
  proofTitle: 'Recorded real routes',
  proofDescription: 'Real GPS examples from 3 recorded days',
  proofCta: 'View routes',
  proofGoogleCta: 'Google profile',
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
  visibilityCardBasicTitle: 'Start',
  visibilityCardBasicPlacement: 'rear',
  visibilityCardProTitle: 'Standard',
  visibilityCardProPlacement: 'side panels',
  visibilityCardExclusiveTitle: 'Premium',
  visibilityCardExclusivePlacement: 'full vehicle wrap',
  visibilityCaption:
    'Estimate based on the real route and daily traffic',
  visibilityIndicative: '· indicative visibility',
} as const;
