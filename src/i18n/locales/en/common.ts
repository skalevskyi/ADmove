/**
 * EN — shared: locations, nav, footer, floating, mobileNav, theme, language.
 */

export const locations = {
  montpellier: 'Montpellier',
  portMarianne: 'Port Marianne',
  carnon: 'Carnon',
  palavas: 'Palavas',
  grandeMotte: 'La Grande-Motte',
} as const;

export const nav = {
  support: 'Process',
  parcours: 'Route',
  offres: 'Offers',
  contact: 'Contact',
  ariaLabel: 'Main navigation',
} as const;

export const footer = {
  links: {
    support: 'Process',
    parcours: 'Route',
    offres: 'Offers',
    contact: 'Contact',
  },
  positioning: 'Local mobile advertising between Montpellier and the coast.',
  tagline:
    'Mobile advertising Montpellier & Coast — Carnon, Palavas, La Grande-Motte, Port Marianne.',
  copyright: '© ADMOVE',
} as const;

export const floating = {
  scrollTop: 'Back to top',
} as const;

export const mobileNav = {
  home: 'Home',
  support: 'Process',
  parcours: 'Route',
  offres: 'Offers',
  contact: 'Contact',
  homeAria: 'Back to home',
  ariaLabel: 'Mobile navigation',
} as const;

export const theme = {
  light: 'Light mode',
  dark: 'Dark mode',
} as const;

export const language = {
  label: 'Language',
  fr: 'Français',
  en: 'English',
  ua: 'Українська',
} as const;
