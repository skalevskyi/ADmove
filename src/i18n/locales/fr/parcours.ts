/**
 * FR — Parcours section. B2B advertising exposure; right column: dynamic title + description, static bullets + note.
 */

export const parcours = {
  title: 'Parcours et zones de visibilité',
  subtitle:
    'Présence quotidienne sur des axes à fort trafic entre Montpellier et le littoral.',
  timelineHint:
    'Cliquez sur une étape pour mettre en pause et voir les détails.',
  descriptors: {
    montpellier: 'centre urbain',
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
      bullet2: 'Contacts répétés avec une audience locale active',
      bullet3: 'Présence visible dans les zones de circulation et d’arrêt',
    },
    portMarianne: {
      description:
        "Quartier actif: passages fréquents et visibilité lors des arrêts.",
      tag: 'Quartier actif',
      icon: 'district',
      bullet1: 'Visibilité dans un quartier à forte activité locale',
      bullet2: 'Contacts fréquents avec une audience urbaine régulière',
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
      bullet2: 'Contacts répétés avec une audience locale et de passage',
      bullet3: 'Bonne visibilité dans les zones d’arrêt et de parking',
    },
    grandeMotte: {
      description:
        'Secteur littoral dense: visibilité renforcée par une circulation régulière.',
      tag: 'Zone animée',
      icon: 'coast',
      bullet1: 'Visibilité dans une zone côtière animée',
      bullet2: 'Contacts réguliers avec une audience mobile et locale',
      bullet3: 'Présence renforcée dans les zones de circulation et de stationnement',
    },
  },
  sharedBullets: {
    bullet1:
      "Exposition directe dans les flux quotidiens (automobilistes et piétons)",
    bullet2: 'Contacts répétés avec une audience locale stable',
    bullet3: 'Visibilité renforcée lors des arrêts et stationnements',
    note: 'Visibilité indicative basée sur les flux locaux.',
  },
  visibilityTitle: 'Estimation de la visibilité',
  visibilityBlockTitle: 'Estimation de visibilité sur ce parcours',
  visibilityIntro:
    'Estimations basées sur les flux locaux et la répétition quotidienne.',
  visibilityIntro2: '',
  visibilitySummary: 'Exemples indicatifs par format',
  visibilityRear: 'BASIC (arrière) — ~5 000 / jour, ~110 000 / mois',
  visibilitySide: 'PRO (latéral) — ~7 000 / jour, ~150 000 / mois',
  visibilityFull: 'EXCLUSIVE (habillage complet) — ~9 000 / jour, ~200 000 / mois',
  visibilityIndicative: '· visibilité indicative',
} as const;
