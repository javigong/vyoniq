"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-vyoniq-blue to-vyoniq-green"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue mb-6">Why Choose Vyoniq?</h2>
          <p className="text-lg text-vyoniq-text mb-8 leading-relaxed">
            Vyoniq leverages AI agents under the leadership of our Founder and Software Developer to deliver world-class
            solutions with unmatched efficiency. We combine cutting-edge technology with human expertise to create
            software that doesn't just meet your needs—it anticipates them.
          </p>
          <Button asChild variant="link" className="text-vyoniq-green hover:text-vyoniq-purple font-semibold text-lg">
            <Link href="/about">Meet Our Vision →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
