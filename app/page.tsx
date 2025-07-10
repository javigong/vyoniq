import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ServicesOverview } from "@/components/services-overview";
import { VyoniqAppsSection } from "@/components/vyoniq-apps-section";
import { AboutSection } from "@/components/about-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToContact } from "@/components/scroll-to-contact";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesOverview />
      <VyoniqAppsSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactForm />
      <Footer />
      <Toaster />
      <ScrollToContact />
    </main>
  );
}
