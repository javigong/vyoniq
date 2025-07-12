import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { getBaseUrl } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Vyoniq | AI-Powered Software Development & LLM Integration Services",
  description:
    "Professional AI-powered software development company specializing in LLM integration, AI agents, web & mobile apps, MCP servers, and modern AI development tools. Transform your business with cutting-edge AI solutions.",
  keywords: [
    "AI software development",
    "LLM integration",
    "AI agents",
    "Vyoniq",
    "web development",
    "mobile apps",
    "MCP servers",
    "AI integrations",
    "Cursor IDE",
    "artificial intelligence",
    "software development company",
    "AI consulting",
    "machine learning",
    "AI development tools",
    "newsletter",
  ],
  openGraph: {
    title:
      "Vyoniq | AI-Powered Software Development & LLM Integration Services",
    description:
      "Professional AI-powered software development company specializing in LLM integration, AI agents, web & mobile apps, and modern AI development tools.",
    url: getBaseUrl(),
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Vyoniq+AI+Software+Development",
        width: 1200,
        height: 630,
        alt: "Vyoniq - AI-Powered Software Development Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Vyoniq | AI-Powered Software Development & LLM Integration Services",
    description:
      "Professional AI-powered software development company specializing in LLM integration, AI agents, and modern AI development tools.",
    images: [
      "/placeholder.svg?height=630&width=1200&text=Vyoniq+AI+Software+Development",
    ],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#6E56CF",
          colorText: "#1D1D1F",
        },
      }}
      localization={{
        signUp: {
          start: {
            title: "Join Vyoniq Community",
            subtitle: "Create your account to access your dashboard",
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Google Analytics 4 */}
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                      page_title: document.title,
                      page_location: window.location.href,
                    });
                  `,
                }}
              />
            </>
          )}
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
