import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join Vyoniq Tables Waitlist | Early Access to AI Data Management",
  description:
    "Sign up for exclusive early access to Vyoniq Tables - the revolutionary AI-powered data management platform. Be among the first to experience the future of intelligent data processing.",
  keywords: [
    "Vyoniq Tables waitlist",
    "AI data management signup",
    "early access",
    "data management platform",
    "AI software waitlist",
    "smart data entry",
    "MCP server integration",
    "exclusive access",
  ],
  openGraph: {
    title: "Join Vyoniq Tables Waitlist | Early Access to AI Data Management",
    description:
      "Sign up for exclusive early access to Vyoniq Tables - the revolutionary AI-powered data management platform.",
    url: "https://vyoniq.com/sign-up",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Join+Vyoniq+Tables+Waitlist",
        width: 1200,
        height: 630,
        alt: "Join Vyoniq Tables waitlist for early access",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Vyoniq Tables Waitlist | Early Access to AI Data Management",
    description:
      "Sign up for exclusive early access to Vyoniq Tables - the revolutionary AI-powered data management platform.",
    images: ["/placeholder.svg?height=630&width=1200&text=Join+Vyoniq+Tables+Waitlist"],
  },
  alternates: {
    canonical: "https://vyoniq.com/sign-up",
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

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-vyoniq-dark-card/90">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-vyoniq-blue dark:text-white">Join Vyoniq Tables Waitlist</CardTitle>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  Be the first to experience the future of data management
                </p>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="bg-vyoniq-blue/10 dark:bg-vyoniq-green/10 rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-4">
                    Clerk Integration Required
                  </h3>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                    This page will integrate with Clerk for authentication once the service is configured.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
