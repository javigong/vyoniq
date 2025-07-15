import Script from "next/script"

interface StructuredDataProps {
  type: "Organization" | "WebPage" | "Service" | "Product"
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  }

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

// Organization structured data for the main site
export function OrganizationStructuredData() {
  const organizationData = {
    name: "Vyoniq",
    alternateName: "Vyoniq Technologies",
    description:
      "Professional AI-powered software development company specializing in LLM integration, AI agents, web & mobile apps, MCP servers, and modern AI development tools.",
    url: "https://vyoniq.com",
    logo: {
      "@type": "ImageObject",
      url: "https://vyoniq.com/placeholder-logo.png",
      width: 200,
      height: 200,
    },
    image: "https://vyoniq.com/placeholder.svg?height=630&width=1200&text=Vyoniq+AI+Software+Development",
    contactPoint: [
      {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://vyoniq.com/#contact",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        url: "https://vyoniq.com/#contact",
        availableLanguage: "English",
    },
    ],
    sameAs: [
      "https://linkedin.com/company/vyoniq",
      "https://github.com/vyoniq",
      "https://twitter.com/vyoniq",
    ],
    foundingDate: "2025",
    founder: {
      "@type": "Person",
      name: "Javier Gongora",
      jobTitle: "Founder & Software Developer",
      description: "Expert in LLM integration, AI agents, and modern AI development tools",
      url: "https://vyoniq.com/about",
      sameAs: [
        "https://linkedin.com/in/javier-gongora",
        "https://github.com/javigong",
      ],
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    serviceType: [
      "LLM Integration Services",
      "AI Agent Development",
      "Web Application Development",
      "Mobile App Development",
      "MCP Server Implementation",
      "AI Development Consulting",
      "Software Development Services",
      "AI Integration Services",
    ],
    knowsAbout: [
      "Large Language Models",
      "AI Agents",
      "Machine Learning",
      "Software Development",
      "Web Development",
      "Mobile Development",
      "AI Integration",
      "MCP Servers",
      "Cursor IDE",
      "Next.js",
      "React",
      "TypeScript",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vyoniq AI Software Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "LLM Integration Services",
            description: "Professional Large Language Model integration and AI agent development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web & Mobile App Development",
            description: "AI-powered web and mobile application development with modern frameworks",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "MCP Server Implementation",
            description: "Model Context Protocol server development for AI agent integration",
          },
        },
      ],
    },
  }

  return <StructuredData type="Organization" data={organizationData} />
}

// Website structured data
export function WebsiteStructuredData() {
  const websiteData = {
    "@type": "WebSite",
    name: "Vyoniq",
    alternateName: "Vyoniq Technologies",
    url: "https://vyoniq.com",
    description:
      "Professional AI-powered software development company specializing in LLM integration, AI agents, and modern AI development tools.",
    publisher: {
      "@type": "Organization",
      name: "Vyoniq",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://vyoniq.com/blog?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "Organization",
      name: "Vyoniq",
    },
  }

  return <StructuredData type="WebSite" data={websiteData} />
}
