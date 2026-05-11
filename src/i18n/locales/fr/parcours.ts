/**
 * FR — Parcours section. B2B advertising exposure; right column: dynamic title + description, static bullets + note.
 */

export const parcours = {
  title: 'Un parcours réel, visible chaque jour',
  subtitle:
    'Trajet réel sur le corridor Montpellier–littoral, repris chaque jour dans les deux sens.',
  timelineHint:
    'Cliquez sur une étape pour mettre en pause et voir les détails.',
  descriptors: {
    montpellier: 'centre urbain',
    perols: 'axe vers la mer',
    portMarianne: 'quartier actif',
    carnon: 'axe littoral',
    palavas: 'front de mer',
    grandeMotte: 'zone fréquentée',
  },
  locationContent: {
    montpellier: {
      description:
        'Noyau urbain dense : forte exposition aux flux du quotidien et ancrage local du message au départ du trajet.',
      tag: 'Centre de flux',
      icon: 'city',
      bullet1:
        'Densité de passages : la marque apparaît au cœur des déplacements locaux.',
      bullet2:
        'Contacts fréquents avec une population proche du corridor.',
      bullet3:
        'Lecture possible dans les files, intersections et zones d’arrêt.',
    },
    perols: {
      description:
        'Liaison centre-ville → littoral : l’axe canalise les flux avant d’atteindre la mer.',
      tag: 'Axe vers la mer',
      icon: 'district',
      bullet1:
        'Passages réguliers pendant la phase de trajet encore urbaine.',
      bullet2:
        'Continuité de présence sur la sortie progressive vers le littoral.',
      bullet3:
        'Moments lisibles lorsque le flux se concentre sur l’axe.',
    },
    portMarianne: {
      description:
        'Quartier à forte dynamique : mobilité locale et flux du quotidien entre activités et résidences.',
      tag: 'Quartier actif',
      icon: 'district',
      bullet1:
        'Circulation structurée entre zones d’activités et quartiers.',
      bullet2:
        'Audience régulière en courts déplacements récurrents.',
      bullet3:
        'Visibilité lors des phases de files et de ralentissement.',
    },
    carnon: {
      description:
        'Segment clé du corridor littoral : passage soutenu entre flux urbains et déplacements vers la côte.',
      tag: 'Axe vers le littoral',
      icon: 'route',
      bullet1:
        'Exposition sur l’axe où le trajet prolonge le corridor vers la mer.',
      bullet2:
        'Le message retrouvé à différents moments de la journée sur le même parcours.',
      bullet3:
        'Lecture renforcée aux ralentissements et aux croisements.',
    },
    palavas: {
      description:
        'Approche du front de mer : circulation plus lente, temps de regard plus long pour le message.',
      tag: 'Points d’arrêt',
      icon: 'stop',
      bullet1:
        'Trafic côtier où les véhicules restent plus longtemps dans le champ visuel.',
      bullet2:
        'Marque croisée dans les flux vers ou depuis le littoral.',
      bullet3:
        'Moments lisibles près des zones d’arrêt et de stationnement.',
    },
    grandeMotte: {
      description:
        'Secteur littoral dense en fin de trajet : forte exposition dans un pôle fortement parcouru.',
      tag: 'Zone animée',
      icon: 'coast',
      bullet1:
        'Exposition dans une zone d’activité du littoral à fort passage.',
      bullet2:
        'Retrouvailles répétées du message pour une reconnaissance progressive.',
      bullet3:
        'Présence soutenue dans les flux d’accès et de stationnement.',
    },
  },
  sharedBullets: {
    bullet1:
      "Exposition dans les flux réels du trajet (automobilistes et piétons)",
    bullet2: 'Retours réguliers du message pour une audience locale',
    bullet3: 'Lecture favorable lors des arrêts et stationnements',
    note: 'Visibilité indicative basée sur les flux locaux.',
  },
  proofTitle: 'Trajets réels enregistrés',
  proofDescription: 'Exemples de circulation réelle sur 7 jours',
  proofCta: 'Voir les trajets →',
  visibilityTitle: 'Estimation de visibilité locale',
  visibilityBlockTitle: 'Estimation de visibilité locale',
  visibilityIntro:
    'Basée sur le trajet réel et le trafic quotidien.',
  visibilityIntro2: '',
  visibilitySummary: 'Exemples indicatifs par format',
  visibilityMetricBasic: '60 000 – 100 000',
  visibilityMetricPro: '100 000 – 150 000',
  visibilityMetricExclusive: '130 000 – 200 000',
  visibilityContactsUnit: 'vues locales / mois',
  visibilityCardBasicTitle: 'Start',
  visibilityCardBasicPlacement: 'arrière',
  visibilityCardProTitle: 'Standard',
  visibilityCardProPlacement: 'latéral',
  visibilityCardExclusiveTitle: 'Premium',
  visibilityCardExclusivePlacement: 'habillage complet',
  visibilityCaption:
    'Estimation basée sur le trajet réel et le trafic quotidien',
  visibilityIndicative: '· visibilité indicative',
} as const;
