import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

import { OrganizationJsonLd } from '@/components/OrganizationJsonLd';
import { Providers } from '@/components/Providers';
import { BASE_PATH } from '@/lib/base-path';
import { getPublicSiteUrl } from '@/lib/site-url';

import './globals.css';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
});

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SPM — Publicité mobile Montpellier',
    template: '%s | SPM',
  },
  description:
    'Publicité mobile sur véhicule à Montpellier et sur le littoral (Port Marianne, Carnon, Palavas, La Grande-Motte). Formats Rear, Side, Full. Estimation en ligne.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'SPM',
    title: 'SPM — Publicité mobile Montpellier',
    description:
      'Publicité mobile sur véhicule à Montpellier et sur le littoral. Visibilité locale B2B — estimation en ligne.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPM — Publicité mobile Montpellier',
    description:
      'Publicité mobile sur véhicule à Montpellier et sur le littoral. Formats Rear, Side, Full.',
  },
  icons: {
    icon: [
      { url: `${BASE_PATH}/logo/favicon.ico` },
      {
        url: `${BASE_PATH}/logo/favicon-96x96.png`,
        sizes: '96x96',
        type: 'image/png',
      },
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
  /** Aligns with `public/logo/site.webmanifest` theme/background (#fff) for PWA chrome + launch. */
  themeColor: '#ffffff',
};

/**
 * Mirrors `ThemeContext` resolution: `spm-theme` (`light`|`dark`|`auto`) → legacy `*-theme` → `prefers-color-scheme`.
 * In standalone (installed PWA), skip toggling `dark` here so the first paint can match the white
 * manifest launch contract; `ThemeProvider` applies the class in `useLayoutEffect` on the client.
 */
const themeScript = `
(function(){
  var KEY='spm-theme';
  var s=localStorage.getItem(KEY);
  var dark;
  if(s==='dark'){dark=true;}
  else if(s==='light'){dark=false;}
  else if(s==='auto'){
    dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  else{
    var legacy=null;
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(!k||k===KEY)continue;
      if(!k.endsWith('-theme'))continue;
      var v=localStorage.getItem(k);
      if(v==='dark'||v==='light'){legacy=v;break;}
    }
    if(legacy==='dark')dark=true;
    else if(legacy==='light')dark=false;
    else dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  var standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  if(!standalone){
    document.documentElement.classList.toggle('dark',!!dark);
  }
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
        <OrganizationJsonLd />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
