"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:h-[600px] bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm"></div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Vyoniq: Innovate Faster with <span className="text-vyoniq-green">AI-Powered</span> Software Solutions
            </h1>
            <p className="text-lg md:text-xl text-gray-100 dark:text-vyoniq-dark-muted mb-8 max-w-2xl">
              Web & Mobile Apps, Hosting, AI Integrations, and Coming Soon: Vyoniq Tables for Smart Data Management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-vyoniq-purple hover:bg-vyoniq-purple/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Link href="#contact">Get a Quote</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-vyoniq-blue hover:border-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Link href="/sign-up">Join Vyoniq Tables Waitlist</Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="flex-1 max-w-lg animate-slide-in">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="AI-powered software development visualization"
              width={600}
              height={500}
              className="w-full h-auto rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
