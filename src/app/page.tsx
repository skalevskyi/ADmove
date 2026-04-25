import { FloatingActions } from '@/components/FloatingActions';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Navbar } from '@/components/Navbar';
import { ContactSection } from '@/components/sections/ContactSection';
import { ConceptSection } from '@/components/sections/ConceptSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { OffresSection } from '@/components/sections/OffresSection';
import { VehicleSection } from '@/components/sections/VehicleSection';

/**
 * SPM landing page (Phase 2B — functional).
 * Main: Hero, Concept, Vehicle, Offres (estimation calculator + CTA), Contact (lead form → POST /api/lead).
 * Shell: footer, mobile bottom nav, floating scroll-to-top.
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="max-md:pb-[var(--shell-mobile-bottom-occupancy)] max-md:pt-[var(--shell-main-padding-top-mobile)] md:pb-0 md:pt-4">
        <HeroSection />
        <ConceptSection />
        <VehicleSection />
        <OffresSection />
        <ContactSection />
        <Footer />
      </main>
      <MobileBottomNav />
      <FloatingActions />
    </>
  );
}
