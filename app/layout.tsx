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
  title: "Vyoniq | AI-Powered Software Solutions",
  description:
    "Innovative AI-driven software development company specializing in web & mobile apps, hosting services, and AI integrations. Join the waitlist for Vyoniq Apps.",
  keywords: [
    "AI",
    "software development",
    "Vyoniq Apps",
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
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignInUrl="/redirect-after-auth"
      afterSignUpUrl="/redirect-after-auth"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          />
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
