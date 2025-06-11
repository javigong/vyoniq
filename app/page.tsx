"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesOverview } from "@/components/services-overview"
import { VyoniqTablesSection } from "@/components/vyoniq-tables-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { scrollToContact } from "@/lib/scroll-utils"

export default function HomePage() {
  useEffect(() => {
    // Check if URL has #contact hash and scroll to it
    if (window.location.hash === "#contact") {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        scrollToContact()
      }, 100)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesOverview />
      <VyoniqTablesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactForm />
      <Footer />
      <Toaster />
    </main>
  )
}
