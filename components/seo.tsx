import { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateSEOMetadata({
  title = "Vyoniq | AI-Powered Software Development & LLM Integration Services",
  description = "Professional AI-powered software development company specializing in LLM integration, AI agents, web & mobile apps, MCP servers, and modern AI development tools. Transform your business with cutting-edge AI solutions.",
  keywords = [
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
  ],
  image = "/placeholder.svg?height=630&width=1200&text=Vyoniq+AI+Software+Development",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  canonical,
  noindex = false,
  nofollow = false,
}: SEOProps = {}): Metadata {
  const baseUrl = getBaseUrl();
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  const openGraphData: any = {
    title,
    description,
    url: fullUrl,
    siteName: "Vyoniq",
    images: [
      {
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    locale: "en_US",
    type,
  };

  // Add article-specific Open Graph data
  if (type === "article") {
    if (publishedTime) openGraphData.publishedTime = publishedTime;
    if (modifiedTime) openGraphData.modifiedTime = modifiedTime;
    if (authors) openGraphData.authors = authors;
    if (section) openGraphData.section = section;
    if (tags) openGraphData.tags = tags;
  }

  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: openGraphData,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@vyoniq",
      site: "@vyoniq",
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonical || fullUrl,
    },
  };

  return metadata;
}

// Predefined SEO configurations for common pages
export const SEO_CONFIGS = {
  home: {
    title:
      "Vyoniq | AI-Powered Software Development & LLM Integration Services",
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
    url: "/",
  },
  about: {
    title: "About Javier Gongora | Founder & Software Developer | Vyoniq",
    description:
      "Meet Javier Gongora, founder and software developer behind Vyoniq's AI-powered solutions. Learn about his vision for transforming business through innovative LLM and AI agent development.",
    keywords: [
      "Javier Gongora",
      "Vyoniq founder",
      "AI software developer",
      "LLM expert",
      "AI agent development",
      "software development leadership",
      "AI innovation",
      "tech visionary",
      "artificial intelligence expert",
      "business transformation",
    ],
    url: "/about",
    image: "/javier.jpeg",
  },
  services: {
    title: "AI-Powered Software Development Services | Vyoniq",
    description:
      "Comprehensive AI-powered software development services including web & mobile apps, hosting solutions, and AI integrations. Transform your business with cutting-edge technology.",
    keywords: [
      "AI software development",
      "web development services",
      "mobile app development",
      "AI hosting solutions",
      "AI integrations",
      "software development company",
      "React development",
      "Next.js development",
      "cloud hosting",
      "machine learning integration",
    ],
    url: "/services",
  },
  blog: {
    title: "LLM & AI Development Insights | Vyoniq Blog",
    description:
      "Expert insights on Large Language Models, AI agents, Cursor IDE, MCP servers, and LLM integration. Stay updated with the latest AI development trends and best practices.",
    keywords: [
      "LLM blog",
      "Large Language Models",
      "AI agents blog",
      "Cursor IDE insights",
      "MCP servers",
      "LLM integration",
      "AI development tools",
      "AI agent development",
      "tech industry news",
      "Vyoniq insights",
    ],
    url: "/blog",
  },
  vyoniqApps: {
    title: "Stay Updated with Vyoniq's Latest AI Innovations | Newsletter",
    description:
      "Subscribe to Vyoniq's newsletter for the latest updates on AI-powered software development, LLM integration, AI agents, and cutting-edge development tools.",
    keywords: [
      "Vyoniq newsletter",
      "AI innovation updates",
      "LLM integration news",
      "AI agent development",
      "software development trends",
      "AI development tools",
      "tech innovation",
      "AI consulting updates",
    ],
    url: "/vyoniq-apps",
  },
} as const;
