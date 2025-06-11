import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-vyoniq-gray">
      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/90">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-vyoniq-blue">Join Vyoniq Tables Waitlist</CardTitle>
                <p className="text-vyoniq-text">Be the first to experience the future of data management</p>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="bg-vyoniq-blue/5 rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-vyoniq-blue mb-4">Clerk Integration Required</h3>
                  <p className="text-vyoniq-text">
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
