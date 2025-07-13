import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Code, Zap, Rocket, Shield, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customized Web & Mobile Development | AI-Powered Solutions | Vyoniq",
  description:
    "Get custom web and mobile applications built with AI-powered development. Tailored solutions, AI integration, rapid development, and enterprise-grade support included.",
  keywords: [
    "custom web development",
    "mobile app development",
    "AI-powered development",
    "tailored solutions",
    "enterprise applications",
    "software development company",
    "React development",
    "Next.js development",
    "AI integration",
    "rapid development",
  ],
  openGraph: {
    title:
      "Customized Web & Mobile Development | AI-Powered Solutions | Vyoniq",
    description:
      "Get custom web and mobile applications built with AI-powered development. Tailored solutions with AI integration and enterprise-grade support.",
    url: "https://vyoniq.com/services",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Vyoniq+Custom+Development",
        width: 1200,
        height: 630,
        alt: "Vyoniq customized web and mobile development services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Customized Web & Mobile Development | AI-Powered Solutions | Vyoniq",
    description:
      "Get custom web and mobile applications built with AI-powered development. Tailored solutions with AI integration.",
    images: [
      "/placeholder.svg?height=630&width=1200&text=Vyoniq+Custom+Development",
    ],
  },
  alternates: {
    canonical: "https://vyoniq.com/services",
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

const capabilities = [
  {
    icon: Code,
    title: "Tailored Solutions",
    description:
      "Custom applications designed specifically for your business requirements and workflows.",
    features: [
      "Custom Web Applications",
      "Mobile App Development",
      "Business Process Automation",
      "User Experience Design",
    ],
    image: "/web-mobile-service.jpg",
  },
  {
    icon: Zap,
    title: "AI Integration",
    description:
      "Leverage cutting-edge AI and machine learning capabilities integrated seamlessly into your applications.",
    features: [
      "Large Language Models",
      "AI Agents & Automation",
      "Machine Learning Features",
      "Intelligent Data Processing",
    ],
    image: "/ai-integrations-service.jpg",
  },
  {
    icon: Rocket,
    title: "Rapid Development",
    description:
      "Fast turnaround times with our AI-powered development process and experienced approach.",
    features: [
      "AI-Accelerated Coding",
      "Agile Development Process",
      "Continuous Integration",
      "Quick Prototyping",
    ],
    image: "/placeholder.svg?height=300&width=400&text=Rapid+Development",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Support",
    description:
      "Secure, scalable, and reliable applications with deployment and ongoing support included.",
    features: [
      "Cloud Deployment",
      "Security Best Practices",
      "Performance Optimization",
      "Ongoing Maintenance",
    ],
    image: "/hosting-service.jpg",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Customized Web & Mobile Development
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              AI-powered development that delivers tailored solutions for your
              unique business needs
            </p>
            <Button
              asChild
              size="lg"
              className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/#contact">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-4">
              Our Development Capabilities
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text max-w-2xl mx-auto">
              We combine cutting-edge technology with deep business
              understanding to create applications that truly serve your needs
            </p>
          </div>

          <div className="space-y-20">
            {capabilities.map((capability, index) => (
              <div
                key={capability.title}
                className={`flex flex-col ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full mr-4">
                      <capability.icon className="h-8 w-8 text-vyoniq-green" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white">
                      {capability.title}
                    </h3>
                  </div>

                  <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-6 leading-relaxed">
                    {capability.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {capability.features.map((feature) => (
                      <div key={feature} className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-vyoniq-green mr-2" />
                        <span className="text-vyoniq-text dark:text-vyoniq-dark-text">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <Image
                    src={capability.image || "/placeholder.svg"}
                    alt={`${capability.title} illustration`}
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-vyoniq-gray dark:bg-vyoniq-slate">
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
                <Link href="/vyoniq-apps">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
