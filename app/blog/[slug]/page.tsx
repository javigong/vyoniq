import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogAuthor } from "@/components/blog/blog-author";
import { BlogRelatedPosts } from "@/components/blog/blog-related-posts";
import { BlogShareButtons } from "@/components/blog/blog-share-buttons";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import {
  getBlogPosts,
  getBlogPostBySlug,
  BlogPostFormatted,
} from "@/lib/blog-utils";
import { NewsletterFormBlog } from "@/components/newsletter-form-blog";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Vyoniq Blog",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | Vyoniq Blog`,
    description: post.excerpt,
    keywords: [
      ...post.categories,
      "Vyoniq blog",
      "AI insights",
      "software development blog",
    ],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://vyoniq.com/blog/${post.slug}`,
      siteName: "Vyoniq",
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author.name],
      tags: post.categories,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `https://vyoniq.com/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get all posts for related posts calculation
  const allPosts = await getBlogPosts();

  // Get related posts based on categories
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.categories.some((cat) => post.categories.includes(cat))
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen">
      <Header />

      <StructuredData
        type="WebPage"
        data={{
          "@type": "BlogPosting",
          headline: post.title,
          image: post.coverImage,
          datePublished: post.publishDate,
          author: {
            "@type": "Person",
            name: post.author.name,
            jobTitle: post.author.title,
          },
          publisher: {
            "@type": "Organization",
            name: "Vyoniq",
            logo: {
              "@type": "ImageObject",
              url: "https://vyoniq.com/logo.png",
            },
          },
          description: post.excerpt,
          keywords: post.categories.join(", "),
        }}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-10 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  {category}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-200">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{post.publishDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-80 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              {post.tintColor && (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: post.tintColor }}
                />
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Content */}
              <div className="md:w-3/4">
                <MarkdownRenderer content={post.content} />

                <BlogShareButtons title={post.title} slug={post.slug} />
              </div>

              {/* Sidebar */}
              <div className="md:w-1/4">
                <div className="sticky top-24 space-y-8">
                  <BlogAuthor author={post.author} />

                  <NewsletterFormBlog />
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-vyoniq-blue dark:text-white mb-6">
                  Related Articles
                </h2>
                <BlogRelatedPosts posts={relatedPosts} />
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
