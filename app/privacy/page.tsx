import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Vyoniq",
  description:
    "Vyoniq's privacy policy outlines how we collect, use, and protect your personal information when using our AI-powered software development services.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "personal information",
    "data security",
    "Vyoniq privacy",
  ],
  openGraph: {
    title: "Privacy Policy | Vyoniq",
    description:
      "Learn how Vyoniq protects your privacy and handles your personal information.",
    url: "https://vyoniq.com/privacy",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Vyoniq+Privacy+Policy",
        width: 1200,
        height: 630,
        alt: "Vyoniq Privacy Policy",
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
    canonical: "https://vyoniq.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-vyoniq-blue dark:text-white mb-8">
              Privacy Policy
            </h1>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text mb-8">
              Last updated: January 11, 2025
            </p>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    Vyoniq ("we," "our," or "us") is committed to protecting
                    your privacy. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you visit
                    our website or use our AI-powered software development
                    services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    2. Information We Collect
                  </h2>
                  <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-3">
                    Personal Information
                  </h3>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    We may collect personal information that you voluntarily
                    provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>Fill out contact forms or request quotes</li>
                    <li>Subscribe to our newsletter or blog updates</li>
                    <li>Join the Vyoniq Apps waitlist</li>
                    <li>Communicate with us via email or other channels</li>
                    <li>
                      Use our services or engage with our AI development tools
                    </li>
                  </ul>

                  <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-3">
                    Automatically Collected Information
                  </h3>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    When you visit our website, we may automatically collect
                    certain information, including:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>IP address and browser information</li>
                    <li>Device and operating system details</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referring website information</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    We use the information we collect for various purposes,
                    including:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>Providing and maintaining our services</li>
                    <li>
                      Responding to your inquiries and providing customer
                      support
                    </li>
                    <li>
                      Sending you updates about our services and Vyoniq Apps
                      development
                    </li>
                    <li>
                      Improving our website and services based on your feedback
                    </li>
                    <li>Analyzing usage patterns to enhance user experience</li>
                    <li>
                      Complying with legal obligations and protecting our rights
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    4. Information Sharing and Disclosure
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties except in the following
                    circumstances:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>With your explicit consent</li>
                    <li>
                      To trusted service providers who assist in operating our
                      website and services
                    </li>
                    <li>
                      When required by law or to protect our rights and safety
                    </li>
                    <li>
                      In connection with a business transfer or acquisition
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    5. Data Security
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    We implement appropriate technical and organizational
                    security measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or
                    destruction. However, no method of transmission over the
                    internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    6. Your Rights
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    Depending on your location, you may have certain rights
                    regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-6 text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    <li>
                      The right to access and receive a copy of your personal
                      information
                    </li>
                    <li>
                      The right to rectify inaccurate personal information
                    </li>
                    <li>The right to erase your personal information</li>
                    <li>
                      The right to restrict processing of your personal
                      information
                    </li>
                    <li>The right to data portability</li>
                    <li>The right to object to processing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    7. Cookies
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    Our website uses cookies to enhance your browsing
                    experience. You can choose to disable cookies through your
                    browser settings, though this may affect the functionality
                    of our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    8. Changes to This Privacy Policy
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-4">
                    9. Contact Us
                  </h2>
                  <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us at:
                  </p>
                  <div className="bg-vyoniq-gray dark:bg-vyoniq-slate p-6 rounded-lg">
                    <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                      <strong>Email:</strong> privacy@vyoniq.com
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
