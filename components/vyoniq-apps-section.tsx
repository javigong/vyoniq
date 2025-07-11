"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function VyoniqAppsSection() {
  return (
    <section className="py-20 bg-vyoniq-gray dark:bg-vyoniq-slate">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 lg:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">
              Stay Updated with Vyoniq's Latest Innovations
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8 leading-relaxed">
              Get the latest updates on our AI-powered solutions, new blog
              posts, and innovative tools that we're building. Be the first to
              know about our newest applications and services that will
              transform your workflow.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 min-h-[48px] transform hover:scale-105 active:scale-100 transition-all duration-200 touch-manipulation"
            >
              <Link href="#newsletter">Subscribe to Newsletter</Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="flex-1 relative">
            <div className="relative">
              <Image
                src="/newsletter-innovation.jpg"
                alt="Stay updated with Vyoniq's latest AI innovations and technology solutions"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
