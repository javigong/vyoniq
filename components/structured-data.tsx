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
    description:
      "AI-powered software development company specializing in LLM integration, AI agents, and modern development tools like Cursor and MCP servers.",
    url: "https://vyoniq.com",
    logo: "https://vyoniq.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://vyoniq.com/#contact",
    },
    sameAs: ["https://linkedin.com/company/vyoniq", "https://github.com/vyoniq"],
    foundingDate: "2025",
    founder: {
      "@type": "Person",
      name: "Javier Gongora",
      jobTitle: "Founder & Software Developer",
      description: "Expert in LLM integration, AI agents, and modern AI development tools",
    },
    areaServed: "Worldwide",
    serviceType: [
      "LLM Integration",
      "AI Agent Development",
      "Web Development",
      "Mobile App Development",
      "MCP Server Implementation",
      "AI Development Consulting",
    ],
  }

  return <StructuredData type="Organization" data={organizationData} />
}
