/**
 * FR — shared: locations, nav, footer, floating, mobileNav, theme, language.
 */

export const locations = {
  montpellier: 'Montpellier',
  perols: 'Pérols',
  portMarianne: 'Port Marianne',
  carnon: 'Carnon',
  palavas: 'Palavas',
  grandeMotte: 'La Grande-Motte',
} as const;

export const nav = {
  support: 'Processus',
  parcours: 'Parcours',
  offres: 'Offres',
  contact: 'Contact',
  ariaLabel: 'Navigation principale',
} as const;

export const footer = {
  links: {
    support: 'Processus',
    parcours: 'Parcours',
    offres: 'Offres',
    contact: 'Contact',
  },
  positioning: 'Publicité mobile locale entre Montpellier et le littoral.',
  tagline:
    'Publicité mobile Montpellier & Littoral — Pérols, Carnon, Palavas, La Grande-Motte, Port Marianne.',
  copyright: '© Skalevskyi publicité mobile',
} as const;

export const floating = {
  scrollTop: 'Retour en haut',
} as const;

export const mobileNav = {
  home: 'Accueil',
  support: 'Processus',
  parcours: 'Parcours',
  offres: 'Offres',
  contact: 'Contact',
  homeAria: "Retour à l'accueil",
  ariaLabel: 'Navigation mobile',
} as const;

export const theme = {
  light: 'Mode clair',
  dark: 'Mode sombre',
  auto: 'Thème système',
  ariaLight: 'Thème : clair',
  ariaDark: 'Thème : sombre',
  ariaAuto: 'Thème : système',
} as const;

export const language = {
  label: 'Langue',
  fr: 'Français',
  en: 'English',
  ua: 'Українська',
} as const;
