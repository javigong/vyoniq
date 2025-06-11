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
      "AI-powered software development company specializing in web & mobile apps, hosting services, and AI integrations.",
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
      name: "Founder and Software Developer",
    },
    areaServed: "Worldwide",
    serviceType: [
      "Web Development",
      "Mobile App Development",
      "AI Integration",
      "Cloud Hosting",
      "Software Development",
    ],
  }

  return <StructuredData type="Organization" data={organizationData} />
}
