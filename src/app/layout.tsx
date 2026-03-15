import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

import { Providers } from '@/components/Providers';
import { BASE_PATH } from '@/lib/base-path';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'ADMOVE — Publicité mobile Montpellier & Littoral',
  description:
    'Publicité sur véhicule à Montpellier, Port Marianne, Carnon, Palavas, La Grande-Motte. Formats Rear, Side, Full.',
  icons: {
    icon: [
      { url: `${BASE_PATH}/logo/favicon.ico` },
      { url: `${BASE_PATH}/logo/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${BASE_PATH}/logo/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: `${BASE_PATH}/logo/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: `${BASE_PATH}/logo/site.webmanifest`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const themeScript = `
(function(){
  var s=localStorage.getItem('admove-theme');
  var dark=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark',!!dark);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={manrope.variable}>
      <body className="min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
