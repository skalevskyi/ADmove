import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /** Dark surfaces (e.g. promo mini-cards) — slate-900 */
        darkBg: 'rgb(15 23 42)',
        // SPM brand — adjust as needed
        spm: {
          primary: '#0f172a',
          accent: '#0ea5e9',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
