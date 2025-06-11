"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Server, Sparkles } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Code,
    title: "Web & Mobile Development",
    description:
      "AI-optimized web and mobile applications built with cutting-edge technologies for scalability and performance.",
    href: "/services/web-mobile",
  },
  {
    icon: Server,
    title: "Hosting Services",
    description: "Reliable, secure, and scalable hosting solutions powered by AI monitoring and optimization.",
    href: "/services/hosting",
  },
  {
    icon: Sparkles,
    title: "AI Integrations",
    description:
      "Seamlessly integrate AI capabilities into your existing systems to enhance efficiency and automation.",
    href: "/services/ai-integrations",
  },
]

export function ServicesOverview() {
  return (
    <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-4">Our Services</h2>
          <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text max-w-2xl mx-auto">
            Comprehensive AI-powered solutions to accelerate your digital transformation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg bg-white dark:bg-vyoniq-dark-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full w-fit">
                  <service.icon className="h-8 w-8 text-vyoniq-green" />
                </div>
                <CardTitle className="text-xl text-vyoniq-blue dark:text-white group-hover:text-vyoniq-green transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-vyoniq-text dark:text-vyoniq-dark-text mb-6 leading-relaxed">
                  {service.description}
                </CardDescription>
                <Button asChild variant="link" className="text-vyoniq-green hover:text-vyoniq-purple font-semibold">
                  <Link href={service.href}>Learn More →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
