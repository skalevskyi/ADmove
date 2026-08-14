import type { Metadata } from 'next';

import { FloatingActions } from '@/components/FloatingActions';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Navbar } from '@/components/Navbar';
import { TrajetsClient } from '@/components/trajets/TrajetsClient';

export const metadata: Metadata = {
  title: 'Trajets GPS réels sur 7 jours',
  description:
    'Preuve de circulation réelle SPM entre Montpellier et le littoral, avec jours enregistrés par GPS et limites de suivi clairement indiquées.',
  alternates: {
    canonical: '/trajets',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TrajetsPage() {
  return (
    <>
      <Navbar useHomeAnchorHref />
      <main className="max-md:pb-[var(--shell-mobile-bottom-occupancy)] pt-[calc(4rem+env(safe-area-inset-top))] md:pb-0 md:pt-8">
        <TrajetsClient />
        <Footer />
      </main>
      <MobileBottomNav useHomeAnchorHref />
      <FloatingActions />
    </>
  );
}
