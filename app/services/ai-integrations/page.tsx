import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Brain, Eye, TrendingUp, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Integration Services | Machine Learning & NLP Solutions | Vyoniq",
  description:
    "Seamlessly integrate AI capabilities into your existing systems. Custom machine learning models, natural language processing, computer vision, and predictive analytics solutions.",
  keywords: [
    "AI integration services",
    "machine learning integration",
    "natural language processing",
    "computer vision",
    "predictive analytics",
    "AI automation",
    "custom AI models",
    "AI consulting",
    "business intelligence",
    "AI transformation",
  ],
  openGraph: {
    title: "AI Integration Services | Machine Learning & NLP Solutions | Vyoniq",
    description:
      "Seamlessly integrate AI capabilities into your existing systems. Custom machine learning models, NLP, computer vision, and predictive analytics.",
    url: "https://vyoniq.com/services/ai-integrations",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=AI+Integration+Services",
        width: 1200,
        height: 630,
        alt: "AI integration services including machine learning and NLP",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Integration Services | Machine Learning & NLP Solutions | Vyoniq",
    description:
      "Seamlessly integrate AI capabilities into your existing systems. Custom ML models, NLP, and computer vision.",
    images: ["/placeholder.svg?height=630&width=1200&text=AI+Integration+Services"],
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
}

const features = [
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Custom ML models trained for your specific business needs.",
  },
  {
    icon: Sparkles,
    title: "Natural Language Processing",
    description: "Advanced text analysis and conversational AI capabilities.",
  },
  {
    icon: Eye,
    title: "Computer Vision",
    description: "Image and video analysis for automated insights.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Data-driven forecasting and business intelligence.",
  },
]

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
                <Sparkles className="h-12 w-12 text-vyoniq-green" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AI Integration Services</h1>
            <p className="text-xl md:text-2xl text-gray-100 dark:text-vyoniq-dark-muted">
              Seamlessly integrate artificial intelligence to enhance efficiency and automation
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
                Transform your business operations with custom AI solutions that learn, adapt, and optimize
                automatically. Our integration services seamlessly embed AI capabilities into your existing systems,
                providing immediate value while preparing your organization for the future of intelligent automation.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Custom AI model development and training",
                  "Seamless integration with existing systems",
                  "Real-time data processing and insights",
                  "Automated decision-making workflows",
                  "Continuous learning and optimization",
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
                alt="AI integration visualization"
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
