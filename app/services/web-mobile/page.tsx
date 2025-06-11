import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Smartphone, Zap, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI-Powered Web & Mobile App Development | Vyoniq",
  description:
    "Professional web and mobile app development with AI optimization. React, Next.js, React Native applications built for scalability, performance, and cross-platform compatibility.",
  keywords: [
    "AI web development",
    "mobile app development",
    "React development",
    "Next.js development",
    "React Native",
    "cross-platform apps",
    "AI-optimized code",
    "scalable applications",
    "progressive web apps",
    "mobile-first development",
  ],
  openGraph: {
    title: "AI-Powered Web & Mobile App Development | Vyoniq",
    description:
      "Professional web and mobile app development with AI optimization. React, Next.js, React Native applications built for scalability and performance.",
    url: "https://vyoniq.com/services/web-mobile",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Web+Mobile+Development",
        width: 1200,
        height: 630,
        alt: "AI-powered web and mobile app development services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Web & Mobile App Development | Vyoniq",
    description:
      "Professional web and mobile app development with AI optimization. React, Next.js, React Native applications.",
    images: ["/placeholder.svg?height=630&width=1200&text=Web+Mobile+Development"],
  },
  alternates: {
    canonical: "https://vyoniq.com/services/web-mobile",
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

const features = [
  {
    icon: Code,
    title: "Modern Frameworks",
    description: "Built with React, Next.js, and React Native for optimal performance.",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Single codebase for web, iOS, and Android applications.",
  },
  {
    icon: Zap,
    title: "AI-Optimized",
    description: "Code optimization and performance tuning powered by AI.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Built-in security features and compliance standards.",
  },
]

export default function WebMobilePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 dark:bg-vyoniq-green/20 rounded-full">
                <Code className="h-12 w-12 text-vyoniq-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AI-Powered Web & Mobile Apps</h1>
            <p className="text-xl md:text-2xl text-gray-100 dark:text-vyoniq-dark-muted">
              Scalable applications built with cutting-edge technologies and AI optimization
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
                Transform Your Ideas Into Reality
              </h2>
              <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-6 leading-relaxed">
                Our AI-powered development process ensures your web and mobile applications are not just built to
                current standards, but optimized for future scalability. We leverage machine learning to identify
                performance bottlenecks, security vulnerabilities, and user experience improvements before they become
                issues.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Scalable apps with AI-optimized code",
                  "Cross-platform compatibility",
                  "Real-time performance monitoring",
                  "Automated testing and deployment",
                  "Progressive Web App capabilities",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-vyoniq-green mr-3" />
                    <span className="text-vyoniq-text dark:text-vyoniq-dark-text">{benefit}</span>
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
                src="/placeholder.svg?height=400&width=600"
                alt="Web and mobile app development showcase"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center border-0 shadow-lg bg-white dark:bg-vyoniq-dark-card">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-vyoniq-green" />
                  </div>
                  <CardTitle className="text-xl text-vyoniq-blue dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
