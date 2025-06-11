"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function VyoniqTablesSection() {
  return (
    <section className="py-20 bg-vyoniq-gray dark:bg-vyoniq-slate">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 lg:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">
              Vyoniq Tables: Coming Soon to Revolutionize Data Management
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8 leading-relaxed">
              Our AI-powered app, in development, will simplify data entry and enable seamless chat interactions via MCP
              servers. Experience the future of intelligent data management with automated workflows and natural
              language processing.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-vyoniq-green hover:bg-vyoniq-green/90 active:bg-vyoniq-green/80 text-white font-semibold px-8 py-4 min-h-[48px] transform hover:scale-105 active:scale-100 transition-all duration-200 touch-manipulation"
            >
              <Link href="/sign-up">Join the Waitlist</Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="flex-1 relative">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Vyoniq Tables data management interface mockup"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-xl"
              />
              {/* In Development Watermark */}
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40 rounded-lg flex items-center justify-center">
                <div className="bg-white/90 dark:bg-vyoniq-dark-card/90 px-6 py-3 rounded-lg transform -rotate-12">
                  <span className="text-vyoniq-blue dark:text-white font-bold text-lg">In Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
