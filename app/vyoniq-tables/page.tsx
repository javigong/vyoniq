import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, MessageSquare, Zap, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const features = [
  {
    icon: Database,
    title: "Smart Data Entry",
    description: "AI-powered data entry that learns from your patterns and automates repetitive tasks.",
  },
  {
    icon: MessageSquare,
    title: "Chat Interface",
    description: "Natural language interactions with your data through MCP server integration.",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Lightning-fast data processing and analysis with instant insights.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption and compliance standards.",
  },
]

export default function VyoniqTablesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Vyoniq Tables: Coming Soon</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              The future of intelligent data management is almost here
            </p>
            <Button
              asChild
              size="lg"
              className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/sign-up">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue mb-4">Revolutionary Features</h2>
            <p className="text-lg text-vyoniq-text max-w-2xl mx-auto">
              Experience the next generation of data management with AI-powered capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={feature.title} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-vyoniq-green" />
                  </div>
                  <CardTitle className="text-xl text-vyoniq-blue">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-vyoniq-text">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mockup Section */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Vyoniq Tables interface preview"
                width={800}
                height={500}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              {/* Work in Progress Watermark */}
              <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                <div className="bg-white/95 px-8 py-4 rounded-lg transform -rotate-12 shadow-xl">
                  <span className="text-vyoniq-blue font-bold text-2xl">Work in Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-vyoniq-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue mb-6">
              Be Among the First to Experience Vyoniq Tables
            </h2>
            <p className="text-lg text-vyoniq-text mb-8">
              Join our exclusive waitlist and get early access to the most advanced data management platform ever
              created.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/sign-up">Join Waitlist Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
