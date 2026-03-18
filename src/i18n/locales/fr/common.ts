/**
 * FR — shared: locations, nav, footer, floating, mobileNav, theme, language.
 */

export const locations = {
  montpellier: 'Montpellier',
  portMarianne: 'Port Marianne',
  carnon: 'Carnon',
  palavas: 'Palavas',
  grandeMotte: 'La Grande-Motte',
} as const;

export const nav = {
  support: 'Fonctionnement',
  parcours: 'Parcours',
  offres: 'Offres',
  contact: 'Contact',
  ariaLabel: 'Navigation principale',
} as const;

export const footer = {
  links: {
    support: 'Fonctionnement',
    parcours: 'Parcours',
    offres: 'Offres',
    contact: 'Contact',
  },
  positioning: 'Publicité mobile locale entre Montpellier et le littoral.',
  tagline:
    'Publicité mobile Montpellier & Littoral — Carnon, Palavas, La Grande-Motte, Port Marianne.',
  copyright: '© ADMOVE',
} as const;

export const floating = {
  scrollTop: 'Retour en haut',
} as const;

export const mobileNav = {
  home: 'Accueil',
  support: 'Fonctionnement',
  parcours: 'Parcours',
  offres: 'Offres',
  contact: 'Contact',
  homeAria: "Retour à l'accueil",
  ariaLabel: 'Navigation mobile',
} as const;

export const theme = {
  light: 'Mode clair',
  dark: 'Mode sombre',
} as const;

export const language = {
  label: 'Langue',
  fr: 'Français',
  en: 'English',
  ua: 'Українська',
} as const;
