import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
}

// Updated default SEO configuration focusing on AI agents and MCP
const defaultSEO: SEOConfig = {
  title: "Vyoniq - LLM AI Agent Development & MCP Server Solutions",
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
  ],
};

// Page-specific SEO configurations
const pageSEO: Record<string, SEOConfig> = {
  home: {
    title: "Vyoniq - LLM AI Agent Development & MCP Server Solutions",
    description:
      "Leading AI agent development company specializing in LLM-powered agents, MCP server integration, and agentic AI solutions. Build intelligent AI agents with cutting-edge technologies.",
    keywords: [
      "AI agent development company",
      "LLM AI agents",
      "MCP server development",
      "agentic AI solutions",
      "autonomous AI agents",
      "Model Context Protocol",
      "AI agent frameworks",
      "enterprise AI agents",
      "custom AI agents",
      "AI workflow automation",
    ],
  },

  about: {
    title: "About Vyoniq - AI Agent Development Experts",
    description:
      "Meet the team behind Vyoniq's cutting-edge AI agent development. Learn about our expertise in LLM-powered agents, MCP server integration, and agentic AI solutions.",
    keywords: [
      "AI agent development team",
      "LLM AI experts",
      "MCP server specialists",
      "agentic AI developers",
      "AI agent consulting",
      "autonomous AI development",
      "AI technology experts",
      "Model Context Protocol specialists",
    ],
  },

  services: {
    title: "AI Agent Development Services - LLM & MCP Solutions | Vyoniq",
    description:
      "Comprehensive AI agent development services including LLM-powered agents, MCP server integration, autonomous AI systems, and custom agentic AI solutions for enterprises.",
    keywords: [
      "AI agent development services",
      "LLM AI agent consulting",
      "MCP server integration",
      "autonomous AI development",
      "enterprise AI agents",
      "custom AI agent solutions",
      "AI workflow automation",
      "agentic AI services",
      "AI agent frameworks",
      "intelligent automation",
    ],
  },

  "custom-apps": {
    title: "Custom AI Agent Applications - Intelligent Automation Solutions",
    description:
      "Discover our portfolio of custom AI agent applications featuring LLM-powered automation, MCP server integration, and intelligent workflow solutions for modern businesses.",
    keywords: [
      "custom AI agent applications",
      "AI automation solutions",
      "LLM-powered apps",
      "MCP agent integration",
      "intelligent workflow automation",
      "custom agentic AI",
      "enterprise AI applications",
      "AI agent portfolio",
      "autonomous AI systems",
      "business process automation",
    ],
  },

  contact: {
    title: "Contact Vyoniq - AI Agent Development Consultation",
    description:
      "Get in touch with Vyoniq's AI agent development experts. Schedule a consultation for LLM-powered agents, MCP server integration, and custom agentic AI solutions.",
    keywords: [
      "AI agent development consultation",
      "LLM AI agent experts",
      "MCP server consulting",
      "agentic AI consultation",
      "AI agent project inquiry",
      "autonomous AI development",
      "enterprise AI consulting",
      "AI workflow automation experts",
      "custom AI agent quote",
      "AI technology consultation",
    ],
  },

  blog: {
    title: "AI Agent Development Blog - LLM & MCP Insights | Vyoniq",
    description:
      "Stay updated with the latest insights on AI agent development, LLM technologies, MCP server integration, and agentic AI trends from Vyoniq's expert team.",
    keywords: [
      "AI agent development blog",
      "LLM AI insights",
      "MCP server tutorials",
      "agentic AI trends",
      "AI agent frameworks",
      "autonomous AI development",
      "AI technology insights",
      "Model Context Protocol guides",
      "AI automation trends",
      "enterprise AI insights",
    ],
  },

  privacy: {
    title: "Privacy Policy - Vyoniq AI Agent Development",
    description:
      "Vyoniq's privacy policy for AI agent development services, data handling in LLM applications, and MCP server integration projects.",
    keywords: [
      "AI agent privacy policy",
      "LLM data privacy",
      "MCP server data protection",
      "AI development privacy",
      "agentic AI data security",
      "enterprise AI privacy",
    ],
  },

  terms: {
    title: "Terms of Service - Vyoniq AI Agent Development",
    description:
      "Terms of service for Vyoniq's AI agent development, LLM integration services, and MCP server solutions.",
    keywords: [
      "AI agent terms of service",
      "LLM development terms",
      "MCP server service terms",
      "AI development agreement",
      "agentic AI service terms",
    ],
  },
};

export function generateSEOMetadata(
  page: keyof typeof pageSEO,
  customConfig?: Partial<SEOConfig>
): Metadata {
  const config = { ...defaultSEO, ...pageSEO[page], ...customConfig };

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(", "),
    openGraph: {
      title: config.title,
      description: config.description,
      url:
        config.canonical || `https://vyoniq.com/${page === "home" ? "" : page}`,
      siteName: "Vyoniq",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: ["/og-image.jpg"],
      creator: "@vyoniq",
    },
    alternates: {
      canonical:
        config.canonical || `https://vyoniq.com/${page === "home" ? "" : page}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Blog post SEO metadata generator
export function generateBlogSEOMetadata(
  title: string,
  description: string,
  slug: string,
  publishDate?: string,
  tags?: string[]
): Metadata {
  const fullTitle = `${title} | Vyoniq AI Agent Development Blog`;
  const enhancedKeywords = [
    ...defaultSEO.keywords.slice(0, 10), // Core keywords
    ...(tags || []),
    "AI agent insights",
    "LLM development guide",
    "MCP server tutorial",
  ];

  return {
    title: fullTitle,
    description,
    keywords: enhancedKeywords.join(", "),
    openGraph: {
      title: fullTitle,
      description,
      url: `https://vyoniq.com/blog/${slug}`,
      siteName: "Vyoniq",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: publishDate,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og-image.jpg"],
      creator: "@vyoniq",
    },
    alternates: {
      canonical: `https://vyoniq.com/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
