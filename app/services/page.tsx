import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Code, Server, Sparkles, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const services = [
  {
    icon: Code,
    title: "Web & Mobile Development",
    description: "Create stunning, scalable applications with AI-optimized code and cutting-edge technologies.",
    features: ["React & Next.js", "React Native", "AI-Powered Optimization", "Cloud-Native Architecture"],
    href: "/services/web-mobile",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Server,
    title: "Hosting Services",
    description: "Reliable, secure, and scalable hosting solutions with AI monitoring and optimization.",
    features: ["99.9% Uptime", "Auto-Scaling", "AI Monitoring", "Global CDN"],
    href: "/services/hosting",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    icon: Sparkles,
    title: "AI Integrations",
    description: "Seamlessly integrate AI capabilities to enhance efficiency and automation.",
    features: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics"],
    href: "/services/ai-integrations",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Comprehensive AI-powered solutions to accelerate your digital transformation
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-vyoniq-blue/5 rounded-full mr-4">
                      <service.icon className="h-8 w-8 text-vyoniq-green" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue">{service.title}</h2>
                  </div>

                  <p className="text-lg text-vyoniq-text mb-6 leading-relaxed">{service.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-vyoniq-green mr-2" />
                        <span className="text-vyoniq-text">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="bg-vyoniq-purple hover:bg-vyoniq-purple/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
                  >
                    <Link href={service.href}>Learn More</Link>
                  </Button>
                </div>

                <div className="flex-1">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={`${service.title} illustration`}
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

      <Footer />
    </main>
  )
}
