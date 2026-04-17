/**
 * UA — shared. Канонічні назви: Монпельє, Порт-Маріанн, Пероль, Карнон, Палавас, Ла-Гранд-Мотт.
 */

export const locations = {
  montpellier: 'Монпельє',
  perols: 'Пероль',
  portMarianne: 'Порт-Маріанн',
  carnon: 'Карнон',
  palavas: 'Палавас',
  grandeMotte: 'Ла-Гранд-Мотт',
} as const;

export const nav = {
  support: 'Процес',
  parcours: 'Маршрут',
  offres: 'Пропозиції',
  contact: 'Контакт',
  ariaLabel: 'Головна навігація',
} as const;

export const footer = {
  links: {
    support: 'Процес',
    parcours: 'Маршрут',
    offres: 'Пропозиції',
    contact: 'Контакт',
  },
  positioning:
    'Локальна мобільна реклама між Монпельє та узбережжям.',
  tagline:
    'Мобільна реклама Монпельє та узбережжя — Пероль, Карнон, Палавас, Ла-Гранд-Мотт, Порт-Маріанн.',
  copyright: '© Skalevskyi publicité mobile',
} as const;

export const floating = {
  scrollTop: 'Вгору',
} as const;

export const mobileNav = {
  home: 'Головна',
  support: 'Процес',
  parcours: 'Маршрут',
  offres: 'Пропозиції',
  contact: 'Контакт',
  homeAria: 'На головну',
  ariaLabel: 'Мобільна навігація',
} as const;

export const theme = {
  light: 'Світла тема',
  dark: 'Темна тема',
  auto: 'Системна тема',
  ariaLight: 'Тема: світла',
  ariaDark: 'Тема: темна',
  ariaAuto: 'Тема: системна',
} as const;

export const language = {
  label: 'Мова',
  fr: 'Français',
  en: 'English',
  ua: 'Українська',
} as const;
