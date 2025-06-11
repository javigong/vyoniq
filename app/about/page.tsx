import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Javier Gongora | Founder & Software Developer | Vyoniq",
  description:
    "Meet Javier Gongora, founder and software developer behind Vyoniq's AI-powered solutions. Learn about his vision for transforming business through innovative LLM and AI agent development.",
  keywords: [
    "Javier Gongora",
    "Vyoniq founder",
    "AI software developer",
    "LLM expert",
    "AI agent development",
    "software development leadership",
    "AI innovation",
    "tech visionary",
    "artificial intelligence expert",
    "business transformation",
  ],
  openGraph: {
    title: "About Javier Gongora | Founder & Software Developer | Vyoniq",
    description:
      "Meet Javier Gongora, founder and software developer behind Vyoniq's AI-powered solutions. Transforming business through innovative LLM and AI agent development.",
    url: "https://vyoniq.com/about",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Javier+Gongora+Vyoniq+Founder",
        width: 1200,
        height: 630,
        alt: "Javier Gongora, Founder and Software Developer at Vyoniq",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Javier Gongora | Founder & Software Developer | Vyoniq",
    description: "Meet Javier Gongora, founder and software developer behind Vyoniq's AI-powered solutions.",
    images: ["/placeholder.svg?height=630&width=1200&text=Javier+Gongora+Vyoniq+Founder"],
  },
  alternates: {
    canonical: "https://vyoniq.com/about",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-vyoniq-blue dark:text-white mb-6">
                Meet Javier Gongora
              </h1>
              <p className="text-xl text-vyoniq-text dark:text-vyoniq-dark-text max-w-3xl mx-auto">
                Founder & Software Developer driving innovation in AI-powered software development
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <Image
                  src="/placeholder.svg?height=400&width=400&text=Javier+Gongora"
                  alt="Javier Gongora, Founder and Software Developer"
                  width={400}
                  height={400}
                  className="w-full max-w-md mx-auto rounded-full shadow-2xl"
                />
              </div>

              <div className="flex-1 lg:pl-8">
                <h2 className="text-3xl font-bold text-vyoniq-blue dark:text-white mb-6">
                  Founder & Software Developer
                </h2>
                <div className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text space-y-4 leading-relaxed">
                  <p>
                    Javier Gongora is the visionary founder and lead software developer behind Vyoniq, bringing deep
                    expertise in Large Language Models, AI agents, and cutting-edge development tools to transform how
                    businesses leverage artificial intelligence.
                  </p>
                  <p>
                    With a passion for innovation and a keen understanding of the rapidly evolving AI landscape, Javier
                    specializes in LLM integration, AI agent development, and modern development environments like
                    Cursor. His expertise extends to MCP (Model Context Protocol) servers, enabling seamless integration
                    between AI systems and business applications.
                  </p>
                  <p>
                    Under Javier's leadership, Vyoniq has established itself as a forward-thinking company that doesn't
                    just follow AI trends but actively shapes the future of intelligent software development. His
                    hands-on approach ensures that every project benefits from the latest advancements in AI technology
                    while maintaining the highest standards of quality and innovation.
                  </p>
                  <p>
                    When he's not developing cutting-edge AI solutions, Javier shares his insights through Vyoniq's
                    blog, contributing to the broader AI development community and helping businesses understand the
                    transformative potential of modern AI technologies.
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-vyoniq-purple hover:bg-vyoniq-purple/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
                >
                  <Link href="/#contact">Work with Javier</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
