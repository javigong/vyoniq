"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AboutSection() {
  return (
    <section className="py-20 bg-white dark:bg-vyoniq-dark-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-vyoniq-blue to-vyoniq-green"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">Why Choose Vyoniq?</h2>
          <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8 leading-relaxed">
            Vyoniq leverages cutting-edge AI technologies under the leadership of founder and software developer{" "}
            <span className="font-semibold text-vyoniq-blue dark:text-vyoniq-green">Javier Gongora</span> to deliver
            world-class LLM integration, AI agent development, and modern development solutions with unmatched
            efficiency. We combine deep expertise in Large Language Models, AI agents, and tools like Cursor with
            innovative approaches to create software that doesn't just meet your needs—it anticipates them.
          </p>
          <Button asChild variant="link" className="text-vyoniq-green hover:text-vyoniq-purple font-semibold text-lg">
            <Link href="/about">Meet Javier Gongora →</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
