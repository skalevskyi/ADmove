/**
 * FR — Parcours section. B2B advertising exposure; right column: dynamic title + description, static bullets + note.
 */

export const parcours = {
  title: 'Un parcours réel, visible chaque jour',
  subtitle: 'Le même trajet, le même trafic, chaque jour.',
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
        'Centre urbain à fort trafic, circulation quotidienne et visibilité régulière.',
      tag: 'Centre de flux',
      icon: 'city',
      bullet1: 'Visibilité dans les flux urbains quotidiens',
      bullet2: 'Vues répétées par une audience locale active',
      bullet3: 'Présence visible dans les zones de circulation et d’arrêt',
    },
    perols: {
      description:
        'Vers le littoral : passages réguliers et visibilité récurrente dans les flux quotidiens.',
      tag: 'Axe vers la mer',
      icon: 'district',
      bullet1: 'Visibilité lors des passages vers le littoral',
      bullet2: 'Vues répétées pendant les flux réguliers en semaine',
      bullet3: 'Visibilité favorable près des zones de circulation et d’arrêt',
    },
    portMarianne: {
      description:
        "Quartier actif: passages fréquents et visibilité lors des arrêts.",
      tag: 'Quartier actif',
      icon: 'district',
      bullet1: 'Visibilité dans un quartier à forte activité locale',
      bullet2: 'Vues fréquentes par une audience urbaine régulière',
      bullet3: 'Présence renforcée lors des ralentissements et arrêts',
    },
    carnon: {
      description:
        'Axe littoral emprunté : trafic constant et répétition du trajet.',
      tag: 'Axe vers le littoral',
      icon: 'route',
      bullet1: 'Exposition directe sur l’axe vers le littoral',
      bullet2: 'Répétition du message sur un trajet très fréquenté',
      bullet3: 'Visibilité accrue lors des ralentissements et stationnements',
    },
    palavas: {
      description:
        'Zone balnéaire fréquentée: exposition et répétition quotidienne.',
      tag: 'Points d’arrêt',
      icon: 'stop',
      bullet1: 'Présence visible dans les flux vers le front de mer',
      bullet2: 'Vues répétées par une audience locale et de passage',
      bullet3: 'Bonne visibilité dans les zones d’arrêt et de parking',
    },
    grandeMotte: {
      description:
        'Secteur littoral dense: visibilité renforcée par une circulation régulière.',
      tag: 'Zone animée',
      icon: 'coast',
      bullet1: 'Visibilité dans une zone côtière animée',
      bullet2: 'Vues régulières par une audience mobile et locale',
      bullet3: 'Présence renforcée dans les zones de circulation et de stationnement',
    },
  },
  sharedBullets: {
    bullet1:
      "Exposition directe dans les flux quotidiens (automobilistes et piétons)",
    bullet2: 'Vues répétées par une audience locale stable',
    bullet3: 'Visibilité renforcée lors des arrêts et stationnements',
    note: 'Visibilité indicative basée sur les flux locaux.',
  },
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
  visibilityCardBasicTitle: 'BASIC',
  visibilityCardBasicPlacement: 'arrière',
  visibilityCardProTitle: 'PRO',
  visibilityCardProPlacement: 'latéral',
  visibilityCardExclusiveTitle: 'EXCLUSIVE',
  visibilityCardExclusivePlacement: 'habillage complet',
  visibilityCaption:
    'Estimation basée sur le trajet réel et le trafic quotidien',
  visibilityIndicative: '· visibilité indicative',
} as const;
