import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, MessageSquare, Zap, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vyoniq Innovation Hub | Stay Updated with Latest AI Solutions",
  description:
    "Stay updated with Vyoniq's latest AI-powered solutions, blog posts, and innovative tools. Subscribe to our newsletter for exclusive insights and updates.",
  keywords: [
    "Vyoniq Innovation",
    "AI solutions",
    "software development",
    "AI integrations",
    "web development",
    "mobile apps",
    "hosting services",
    "newsletter",
    "technology updates",
  ],
  openGraph: {
    title: "Vyoniq Innovation Hub | Stay Updated with Latest AI Solutions",
    description:
      "Get the latest updates on Vyoniq's AI-powered solutions, new blog posts, and innovative tools. Subscribe to our newsletter for exclusive insights.",
    url: "https://vyoniq.com/vyoniq-apps",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Vyoniq+Innovation+Hub",
        width: 1200,
        height: 630,
        alt: "Vyoniq Innovation Hub - Stay Updated",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyoniq Innovation Hub | Stay Updated with Latest AI Solutions",
    description:
      "Get the latest updates on Vyoniq's AI-powered solutions and innovative tools. Subscribe to our newsletter!",
    images: [
      "/placeholder.svg?height=630&width=1200&text=Vyoniq+Innovation+Hub",
    ],
  },
  alternates: {
    canonical: "https://vyoniq.com/vyoniq-apps",
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
    icon: Database,
    title: "AI-Powered Solutions",
    description:
      "Cutting-edge AI integrations that transform your business processes and workflows.",
  },
  {
    icon: MessageSquare,
    title: "Expert Insights",
    description:
      "In-depth blog posts and technical articles from our development team.",
  },
  {
    icon: Zap,
    title: "Latest Updates",
    description:
      "Be the first to know about new services, tools, and technological breakthroughs.",
  },
  {
    icon: Shield,
    title: "Exclusive Content",
    description:
      "Subscriber-only content including case studies, tutorials, and industry insights.",
  },
];

export default function VyoniqAppsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vyoniq Innovation Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Stay ahead with the latest AI-powered solutions and insights
            </p>
            <Button
              asChild
              size="lg"
              className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
            >
              <Link href="#newsletter">Subscribe to Newsletter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-4">
              What You'll Get
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text max-w-2xl mx-auto">
              Join our newsletter community and get exclusive access to
              insights, updates, and innovative solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="text-center border-0 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow bg-white dark:bg-vyoniq-dark-card"
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

      {/* CTA Section */}
      <section className="py-20 bg-vyoniq-gray dark:bg-vyoniq-slate">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">
              Ready to Stay Updated?
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8">
              Subscribe to our newsletter and be the first to know about our
              latest AI-powered solutions, blog posts, and innovative tools.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
            >
              <Link href="#newsletter">Subscribe Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
