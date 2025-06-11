import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-vyoniq-blue mb-6">Our Visionary Leader</h1>
              <p className="text-xl text-vyoniq-text max-w-3xl mx-auto">
                Meet the innovative mind behind Vyoniq's AI-powered solutions
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Founder and Software Developer headshot"
                  width={400}
                  height={400}
                  className="w-full max-w-md mx-auto rounded-full shadow-2xl"
                />
              </div>

              <div className="flex-1 lg:pl-8">
                <h2 className="text-3xl font-bold text-vyoniq-blue mb-6">Founder & Software Developer</h2>
                <div className="text-lg text-vyoniq-text space-y-4 leading-relaxed">
                  <p>
                    With over a decade of experience in software development and artificial intelligence, our founder
                    has been at the forefront of technological innovation. Their vision for Vyoniq stems from a deep
                    understanding of how AI can transform business operations and accelerate digital transformation.
                  </p>
                  <p>
                    Having worked with Fortune 500 companies and cutting-edge startups, they bring a unique perspective
                    that combines technical excellence with business acumen. This expertise drives Vyoniq's mission to
                    deliver AI-powered solutions that don't just meet current needs but anticipate future challenges.
                  </p>
                  <p>
                    Under their leadership, Vyoniq has developed a reputation for delivering world-class software
                    solutions with unmatched efficiency, leveraging the latest in AI technology to create competitive
                    advantages for our clients.
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="mt-8 bg-vyoniq-amber hover:bg-vyoniq-amber/90 text-white font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
                >
                  <Link href="/#contact">Work with Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
