import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { VyoniqAppsSection } from "@/components/vyoniq-apps-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToContact } from "@/components/scroll-to-contact";
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from "@/components/structured-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Zap, Rocket, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <Header />
      <HeroSection />

      {/* Services Overview Section */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-4">
              Customized Web & Mobile Development
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text max-w-2xl mx-auto">
              We create tailored applications powered by AI that perfectly fit
              your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow bg-white dark:bg-vyoniq-dark-card">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full w-fit">
                  <Code className="h-8 w-8 text-vyoniq-green" />
                </div>
                <CardTitle className="text-xl text-vyoniq-blue dark:text-white">
                  Tailored Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  Custom applications designed specifically for your business
                  requirements and workflows
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow bg-white dark:bg-vyoniq-dark-card">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full w-fit">
                  <Zap className="h-8 w-8 text-vyoniq-green" />
                </div>
                <CardTitle className="text-xl text-vyoniq-blue dark:text-white">
                  AI Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  Leverage cutting-edge AI and machine learning capabilities
                  integrated seamlessly into your applications
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow bg-white dark:bg-vyoniq-dark-card">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full w-fit">
                  <Rocket className="h-8 w-8 text-vyoniq-green" />
                </div>
                <CardTitle className="text-xl text-vyoniq-blue dark:text-white">
                  Rapid Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  Fast turnaround times with our AI-powered development process
                  and experienced approach
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow bg-white dark:bg-vyoniq-dark-card">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-vyoniq-blue/5 dark:bg-vyoniq-green/10 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-vyoniq-green" />
                </div>
                <CardTitle className="text-xl text-vyoniq-blue dark:text-white">
                  Enterprise-Grade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  Secure, scalable, and reliable applications with deployment
                  and ongoing support included
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <VyoniqAppsSection />

      {/* About Vyoniq Section */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-4">
              Why Choose Vyoniq?
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text max-w-3xl mx-auto mb-8">
              Vyoniq is an AI-powered software development company that
              leverages cutting-edge AI agents and advanced automation to
              deliver world-class web and mobile applications with unmatched
              efficiency and innovation.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-vyoniq-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-2">
                  AI-Powered Efficiency
                </h3>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  Our AI agents accelerate development while maintaining the
                  highest quality standards
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-vyoniq-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-2">
                  Tailored Solutions
                </h3>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  Every application is custom-built to solve your specific
                  business challenges
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-vyoniq-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-2">
                  Complete Support
                </h3>
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                  From development to deployment and ongoing maintenance, we've
                  got you covered
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <ContactForm />
      <Footer />
      <Toaster />
      <ScrollToContact />
    </main>
  );
}
