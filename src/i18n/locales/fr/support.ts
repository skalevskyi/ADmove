/**
 * FR — Le média section. Explains the medium; no route names, no formats, no numbers.
 */

export const support = {
  title: 'Comment ça fonctionne',
  subtitle:
    'Un véhicule circule chaque jour sur le même parcours pour créer une visibilité locale répétée.',
  steps: [
    {
      title: 'Parcours quotidien',
      text: 'Le véhicule circule chaque jour sur un itinéraire fixe entre Montpellier et le littoral.',
    },
    {
      title: 'Visibilité réelle',
      text: 'Le message est vu dans le trafic, pendant les arrêts et lors du stationnement.',
    },
    {
      title: 'Répétition',
      text: 'Le même parcours revient régulièrement, ce qui renforce la mémorisation du message.',
    },
    {
      title: 'Accumulation',
      text: 'La visibilité se construit progressivement grâce à la répétition quotidienne.',
    },
  ],
  methodologyTitle: 'Comment la visibilité se construit',
  methodologyText:
    "L’estimation dépend du parcours, du trafic local et de la répétition du trajet.",
} as const;
