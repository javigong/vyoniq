"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
              Vyoniq: Innovate Faster with{" "}
              <span className="text-vyoniq-green whitespace-nowrap">
                AI-Powered
              </span>{" "}
              Software Solutions
            </h1>
            <p className="text-lg md:text-xl text-gray-100 dark:text-vyoniq-dark-muted mb-8 max-w-2xl">
              Web & Mobile Apps, Hosting, AI Integrations, and innovative
              solutions to accelerate your business growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 min-h-[48px] transform hover:scale-105 active:scale-100 transition-all duration-200 touch-manipulation"
              >
                <Link href="#contact">Get in Touch</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 min-h-[48px] transform hover:scale-105 active:scale-100 transition-all duration-200 touch-manipulation backdrop-blur-sm"
              >
                <Link href="#newsletter">Stay Updated</Link>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="flex-1 max-w-sm animate-slide-in -ml-16 hidden lg:block">
            <Image
              src="/rocket-hero.png"
              alt="Stylized rocket launching, symbolizing innovation and speed"
              width={300}
              height={250}
              className="w-full h-auto animate-float transform rotate-45"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
