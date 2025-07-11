import type { Metadata } from "next";
import BlogClientPage from "./BlogClientPage";

export const metadata: Metadata = {
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
  openGraph: {
    title: "LLM & AI Development Insights | Vyoniq Blog",
    description:
      "Expert insights on Large Language Models, AI agents, Cursor IDE, MCP servers, and LLM integration. Stay updated with the latest AI development trends.",
    url: "https://vyoniq.com/blog",
    siteName: "Vyoniq",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Vyoniq+LLM+Blog+Insights",
        width: 1200,
        height: 630,
        alt: "Vyoniq Blog - LLM and AI Development Insights",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM & AI Development Insights | Vyoniq Blog",
    description:
      "Expert insights on Large Language Models, AI agents, Cursor IDE, MCP servers, and LLM integration.",
    images: [
      "/placeholder.svg?height=630&width=1200&text=Vyoniq+LLM+Blog+Insights",
    ],
  },
  alternates: {
    canonical: "https://vyoniq.com/blog",
  },
};

// Enable ISR with revalidation for blog index
export const revalidate = 3600; // Revalidate every hour

export default function BlogPage() {
  return <BlogClientPage />;
}
