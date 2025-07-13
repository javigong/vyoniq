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
  title: {
    default: "Vyoniq - LLM AI Agent Development & MCP Server Solutions",
    template: "%s | Vyoniq - AI Agent Development",
  },
  description:
    "Leading AI agent development company specializing in LLM-powered agents, MCP server integration, and agentic AI solutions. Build intelligent AI agents with cutting-edge technologies like AutoGen, CrewAI, and Model Context Protocol.",
  keywords: [
    // Core AI Agent Technologies
    "AI agent development",
    "LLM AI agents",
    "agentic AI development",
    "autonomous AI agents",
    "intelligent AI agents",

    // MCP and Protocol Technologies
    "MCP server development",
    "Model Context Protocol",
    "MCP integration services",
    "AI agent protocols",
    "MCP server hosting",

    // Trending AI Technologies 2025
    "AI agent frameworks",
    "multi-agent systems",
    "LLM agent orchestration",
    "AI agent automation",
    "conversational AI agents",

    // Development Tools & Frameworks
    "AutoGen Studio development",
    "CrewAI implementation",
    "LangChain agents",
    "AI agent tools",
    "custom AI agents",

    // Business Applications
    "enterprise AI agents",
    "AI workflow automation",
    "business process automation",
    "AI agent consulting",
    "AI agent integration",

    // Emerging Technologies
    "computer using agents",
    "CUA development",
    "voice AI agents",
    "coding AI agents",
    "research AI agents",
  ].join(", "),
  authors: [{ name: "Vyoniq Technologies" }],
  creator: "Vyoniq Technologies",
  publisher: "Vyoniq Technologies",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vyoniq.com",
    siteName: "Vyoniq",
    title: "Vyoniq - LLM AI Agent Development & MCP Server Solutions",
    description:
      "Leading AI agent development company specializing in LLM-powered agents, MCP server integration, and agentic AI solutions. Build intelligent AI agents with cutting-edge technologies.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vyoniq - AI Agent Development Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyoniq - LLM AI Agent Development & MCP Server Solutions",
    description:
      "Leading AI agent development company specializing in LLM-powered agents, MCP server integration, and agentic AI solutions.",
    images: ["/og-image.jpg"],
    creator: "@vyoniq",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://vyoniq.com",
  },
  category: "AI Development",
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
