import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, MessageSquare, Zap, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom App Development | Vyoniq - Tailored AI-Powered Solutions",
  description:
    "Get custom applications built specifically for your business needs. Vyoniq creates tailored AI-powered solutions using cutting-edge technology. Contact us to discuss your project.",
  keywords: [
    "custom app development",
    "AI solutions",
    "software development",
    "tailored applications",
    "web development",
    "mobile apps",
    "custom software",
    "business solutions",
    "technology consulting",
  ],
  openGraph: {
    title: "Custom App Development | Vyoniq - Tailored AI-Powered Solutions",
    description:
      "Get custom applications built specifically for your business needs. Contact us to discuss your tailored AI-powered solution.",
    url: "https://vyoniq.com/vyoniq-apps",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Vyoniq+Custom+App+Development",
        width: 1200,
        height: 630,
        alt: "Vyoniq Custom App Development - Tailored Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom App Development | Vyoniq - Tailored AI-Powered Solutions",
    description:
      "Get custom applications built specifically for your business needs. Contact us to discuss your project!",
    images: [
      "/placeholder.svg?height=630&width=1200&text=Vyoniq+Custom+App+Development",
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
    title: "Tailored Solutions",
    description:
      "Custom applications designed specifically for your business requirements and workflows.",
  },
  {
    icon: MessageSquare,
    title: "AI Integration",
    description:
      "Leverage cutting-edge AI and machine learning capabilities in your custom applications.",
  },
  {
    icon: Zap,
    title: "Rapid Development",
    description:
      "Fast turnaround times with our AI-powered development process and experienced team.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade",
    description:
      "Secure, scalable, and reliable applications built to enterprise standards.",
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
              Custom App Development
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              We specialize in creating custom applications tailored to your
              business needs. From AI-powered solutions to enterprise-grade
              applications, we bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Link href="/#contact">Get a Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-vyoniq-blue font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Link href="#newsletter">Subscribe to Newsletter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-4">
              Why Choose Our Custom Development?
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text max-w-2xl mx-auto">
              We combine cutting-edge technology with deep business
              understanding to create applications that truly serve your needs
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

      {/* Process Section */}
      <section className="py-20 bg-vyoniq-gray dark:bg-vyoniq-slate">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">
              Our Development Process
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8">
              From initial consultation to deployment and beyond, we guide you
              through every step
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-vyoniq-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-2">
                Discovery & Planning
              </h3>
              <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                We analyze your requirements and create a detailed development
                plan
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vyoniq-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-2">
                Development & Testing
              </h3>
              <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                Our AI-powered development process ensures quality and speed
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-vyoniq-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-2">
                Deployment & Support
              </h3>
              <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                We handle deployment and provide ongoing support for your
                application
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-6">
              Ready to Build Your Custom Application?
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8">
              Let's discuss your project requirements and create a solution that
              perfectly fits your needs. Get started with a free consultation
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Link href="/#contact">Contact Us Today</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-vyoniq-green text-vyoniq-green hover:bg-vyoniq-green hover:text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Link href="#newsletter">Stay Updated</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
