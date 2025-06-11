import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vyoniq | AI-Powered Software Solutions",
  description:
    "Innovative AI-driven software development company specializing in web & mobile apps, hosting services, and AI integrations. Join the waitlist for Vyoniq Tables.",
  keywords: [
    "AI",
    "software development",
    "Vyoniq Tables",
    "web development",
    "mobile apps",
    "hosting",
    "AI integrations",
  ],
  openGraph: {
    title: "Vyoniq | AI-Powered Software Solutions",
    description:
      "Innovative AI-driven software development company specializing in web & mobile apps, hosting services, and AI integrations.",
    images: ["/placeholder.svg?height=630&width=1200"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
