/**
 * EN — Le média section. Explains the medium; no route names, no formats, no numbers.
 */

export const support = {
  title: 'How it works',
  subtitle:
    'One vehicle follows the same route every day to create repeated local visibility.',
  steps: [
    {
      title: 'Daily route',
      text: 'The vehicle drives each day on a fixed route between Montpellier and the coast.',
    },
    {
      title: 'Real exposure',
      text: 'The message is seen in traffic, during stops, and while parked.',
    },
    {
      title: 'Repetition',
      text: 'The same route is repeated regularly, reinforcing message recall.',
    },
    {
      title: 'Accumulation',
      text: 'Visibility builds progressively through daily repetition.',
    },
  ],
  methodologyTitle: 'How visibility is built',
  methodologyText:
    'The estimate depends on the route, local traffic, and daily repetition.',
} as const;
