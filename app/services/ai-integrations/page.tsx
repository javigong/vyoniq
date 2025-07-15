import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Bot, Wrench, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Integration Services | LLM & Agentic AI Solutions | Vyoniq",
  description:
    "Transform your business with cutting-edge AI integrations. Large Language Models, Agentic AI, custom AI tools, and intelligent business automation solutions.",
  keywords: [
    "AI integration services",
    "large language models",
    "agentic AI",
    "custom AI tools",
    "business automation",
    "LLM integration",
    "AI agents",
    "intelligent automation",
    "AI consulting",
    "AI transformation",
  ],
  openGraph: {
    title: "AI Integration Services | LLM & Agentic AI Solutions | Vyoniq",
    description:
      "Transform your business with cutting-edge AI integrations. Large Language Models, Agentic AI, custom AI tools, and intelligent business automation.",
    url: "https://vyoniq.com/services/ai-integrations",
    siteName: "Vyoniq",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI integration services including LLM and agentic AI solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Integration Services | LLM & Agentic AI Solutions | Vyoniq",
    description:
      "Transform your business with cutting-edge AI integrations. LLM, Agentic AI, custom tools, and intelligent automation.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://vyoniq.com/services/ai-integrations",
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
};

const features = [
  {
    icon: Brain,
    title: "Large Language Models",
    description:
      "Custom LLM integrations for advanced text generation, analysis, and intelligent conversational interfaces.",
  },
  {
    icon: Bot,
    title: "Agentic AI",
    description:
      "Autonomous AI agents that can reason, plan, and execute complex tasks with minimal human intervention.",
  },
  {
    icon: Wrench,
    title: "Custom AI Tools",
    description:
      "Bespoke AI solutions tailored to your specific workflows, processes, and business requirements.",
  },
  {
    icon: Zap,
    title: "Business Automation",
    description:
      "Intelligent automation systems that streamline operations, reduce costs, and boost productivity.",
  },
];

export default function AIIntegrationsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 dark:bg-vyoniq-green/20 rounded-full">
                <Brain className="h-12 w-12 text-vyoniq-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI Integration Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 dark:text-vyoniq-dark-muted">
              Seamlessly integrate artificial intelligence to enhance efficiency
              and automation
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">
                Unlock the Power of Artificial Intelligence
              </h2>
              <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-6 leading-relaxed">
                Transform your business operations with custom AI solutions that
                learn, adapt, and optimize automatically. Our integration
                services seamlessly embed AI capabilities into your existing
                systems, providing immediate value while preparing your
                organization for the future of intelligent automation.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Large Language Model integrations for intelligent text processing",
                  "Agentic AI systems for autonomous task execution",
                  "Custom AI tools tailored to your specific workflows",
                  "Business automation with intelligent decision-making",
                  "Continuous learning and optimization capabilities",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-vyoniq-green mr-3" />
                    <span className="text-vyoniq-text dark:text-vyoniq-dark-text">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                asChild
                size="lg"
                className="bg-vyoniq-purple hover:bg-vyoniq-purple/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Link href="/#contact">Request a Quote</Link>
              </Button>
            </div>
            <div className="flex-1">
              <Image
                src="/ai-integrations-service.jpg"
                alt="Advanced AI integration technology with neural networks and intelligent systems"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="text-center border-0 shadow-lg bg-white dark:bg-vyoniq-dark-card"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-vyoniq-green" />
                  </div>
                  <CardTitle className="text-xl text-vyoniq-blue dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
