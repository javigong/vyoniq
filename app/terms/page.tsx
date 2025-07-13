import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Vyoniq",
  description:
    "Vyoniq's terms of service outline the rules and regulations for using our AI-powered software development services and website.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "service terms",
    "legal terms",
    "Vyoniq terms",
  ],
  openGraph: {
    title: "Terms of Service | Vyoniq",
    description:
      "Read Vyoniq's terms of service for using our AI-powered software development services.",
    url: "https://vyoniq.com/terms",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Vyoniq+Terms+of+Service",
        width: 1200,
        height: 630,
        alt: "Vyoniq Terms of Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://vyoniq.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-vyoniq-blue dark:text-white mb-8">
              Terms of Service
            </h1>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8">
              Last updated: January 11, 2025
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    By accessing and using Vyoniq's website and services, you
                    accept and agree to be bound by the terms and provision of
                    this agreement. If you do not agree to abide by the above,
                    please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    2. Description of Service
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    Vyoniq provides AI-powered software development services,
                    including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>Web and mobile application development</li>
                    <li>AI integration and LLM implementation services</li>
                    <li>Cloud hosting and infrastructure solutions</li>
                    <li>AI agent development and deployment</li>
                    <li>MCP server implementation and integration</li>
                    <li>Consulting services related to AI development tools</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    3. User Responsibilities
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    As a user of our services, you agree to:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>
                      Provide accurate and complete information when requested
                    </li>
                    <li>Use our services only for lawful purposes</li>
                    <li>
                      Not attempt to gain unauthorized access to our systems
                    </li>
                    <li>Respect intellectual property rights</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>
                      Not use our services to transmit harmful or malicious
                      content
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    4. Intellectual Property
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    The content, organization, graphics, design, compilation,
                    magnetic translation, digital conversion, and other matters
                    related to the Vyoniq website are protected under applicable
                    copyrights, trademarks, and other proprietary rights.
                  </p>
                  <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-3">
                    Client Work Product
                  </h3>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    Upon full payment for services, clients retain ownership of
                    custom-developed applications and solutions created
                    specifically for their use, subject to any third-party
                    licenses and our retained rights in our proprietary
                    methodologies and frameworks.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    5. Service Availability
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    While we strive to maintain high availability of our
                    services, we do not guarantee uninterrupted access. We
                    reserve the right to modify, suspend, or discontinue any
                    aspect of our services with or without notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    6. Payment Terms
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    Payment terms for our services will be specified in
                    individual service agreements. Generally:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>Payment is due according to the agreed schedule</li>
                    <li>Late payments may incur additional fees</li>
                    <li>
                      Refunds are subject to the terms of individual agreements
                    </li>
                    <li>All prices are subject to change with notice</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    7. Privacy and Data Protection
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    Your privacy is important to us. Please review our Privacy
                    Policy, which also governs your use of our services, to
                    understand our practices regarding the collection and use of
                    your information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    8. Limitation of Liability
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    To the fullest extent permitted by law, Vyoniq shall not be
                    liable for any indirect, incidental, special, consequential,
                    or punitive damages, or any loss of profits or revenues,
                    whether incurred directly or indirectly, or any loss of
                    data, use, goodwill, or other intangible losses.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    9. Indemnification
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    You agree to defend, indemnify, and hold harmless Vyoniq and
                    its affiliates from and against any claims, damages, costs,
                    and expenses arising from your use of our services or
                    violation of these terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    10. Governing Law
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    These terms shall be interpreted and governed in accordance
                    with the laws of the jurisdiction where Vyoniq is
                    incorporated, without regard to its conflict of law
                    provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    11. Changes to Terms
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    We reserve the right to modify these terms at any time.
                    Changes will be effective immediately upon posting to our
                    website. Your continued use of our services constitutes
                    acceptance of any changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    12. Contact Information
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    If you have any questions about these Terms of Service,
                    please contact us at:
                  </p>
                  <div className="bg-vyoniq-gray dark:bg-vyoniq-slate p-6 rounded-lg">
                    <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                      <strong>Email:</strong> legal@vyoniq.com
                      <br />
                      <strong>Website:</strong> https://vyoniq.com
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
