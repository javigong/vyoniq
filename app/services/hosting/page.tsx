import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Shield, Zap, Globe, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Powered Cloud Hosting Solutions | 99.9% Uptime | Vyoniq",
  description:
    "Reliable, secure, and scalable cloud hosting with AI monitoring and optimization. Auto-scaling, global CDN, predictive analytics, and 99.9% uptime guarantee.",
  keywords: [
    "AI cloud hosting",
    "scalable hosting solutions",
    "99.9% uptime hosting",
    "auto-scaling hosting",
    "AI monitoring",
    "global CDN",
    "predictive hosting",
    "secure cloud hosting",
    "managed hosting",
    "enterprise hosting",
  ],
  openGraph: {
    title: "AI-Powered Cloud Hosting Solutions | 99.9% Uptime | Vyoniq",
    description:
      "Reliable, secure, and scalable cloud hosting with AI monitoring and optimization. Auto-scaling, global CDN, and 99.9% uptime guarantee.",
    url: "https://vyoniq.com/services/hosting",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=AI+Cloud+Hosting",
        width: 1200,
        height: 630,
        alt: "AI-powered cloud hosting solutions with 99.9% uptime",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Cloud Hosting Solutions | 99.9% Uptime | Vyoniq",
    description:
      "Reliable, secure, and scalable cloud hosting with AI monitoring and optimization. 99.9% uptime guarantee.",
    images: ["/placeholder.svg?height=630&width=1200&text=AI+Cloud+Hosting"],
  },
  alternates: {
    canonical: "https://vyoniq.com/services/hosting",
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
    icon: Server,
    title: "99.9% Uptime",
    description:
      "Guaranteed reliability with redundant infrastructure and monitoring.",
  },
  {
    icon: Zap,
    title: "Auto-Scaling",
    description: "Automatically scales resources based on traffic and demand.",
  },
  {
    icon: Shield,
    title: "AI Monitoring",
    description: "Proactive threat detection and performance optimization.",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Worldwide content delivery for optimal performance.",
  },
];

export default function HostingPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 dark:bg-vyoniq-green/20 rounded-full">
                <Server className="h-12 w-12 text-vyoniq-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Hosting Solutions
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 dark:text-vyoniq-dark-muted">
              Reliable, secure, and scalable hosting with intelligent monitoring
              and optimization
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">
                Next-Generation Hosting Infrastructure
              </h2>
              <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-6 leading-relaxed">
                Our AI-powered hosting platform continuously monitors and
                optimizes your applications for peak performance. With
                predictive scaling, automated security updates, and intelligent
                load balancing, your applications stay fast, secure, and
                available 24/7.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Predictive auto-scaling based on AI analysis",
                  "Real-time security threat detection",
                  "Automated backup and disaster recovery",
                  "Global edge network optimization",
                  "Zero-downtime deployments",
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
                src="/hosting-service.jpg"
                alt="Modern cloud hosting infrastructure with servers and network connectivity"
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
