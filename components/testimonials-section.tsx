"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

const testimonials = [
  {
    quote:
      "Vyoniq's AI-driven approach transformed our app development process. We launched 3 months ahead of schedule!",
    author: "Sarah Chen",
    company: "TechStart Inc.",
  },
  {
    quote: "The hosting solutions are incredibly reliable. Our uptime improved by 99.9% since switching to Vyoniq.",
    author: "Michael Rodriguez",
    company: "DataFlow Solutions",
  },
  {
    quote: "Their AI integrations revolutionized our workflow. We're processing data 10x faster than before.",
    author: "Emily Johnson",
    company: "Analytics Pro",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-vyoniq-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue mb-4">What Our Clients Say</h2>
          <p className="text-lg text-vyoniq-text">Trusted by innovative companies worldwide</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <blockquote className="text-xl md:text-2xl text-vyoniq-text mb-6 italic leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              <div className="text-vyoniq-blue font-semibold">{testimonials[currentIndex].author}</div>
              <div className="text-vyoniq-text">{testimonials[currentIndex].company}</div>
            </CardContent>
          </Card>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-vyoniq-green" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
