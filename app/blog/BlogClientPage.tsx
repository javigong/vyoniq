"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogCategoryFilter } from "@/components/blog/blog-category-filter"
import { blogPosts } from "@/lib/blog-data"

export default function BlogClientPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((post) => post.categories.includes(activeCategory))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.categories.some((cat) => cat.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [activeCategory, searchQuery])

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-vyoniq-blue via-black to-vyoniq-green dark:from-vyoniq-dark-bg dark:via-vyoniq-slate dark:to-vyoniq-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">LLM & AI Development Insights</h1>
            <p className="text-xl md:text-2xl text-gray-100 dark:text-vyoniq-dark-muted">
              Expert analysis on Large Language Models, AI agents, and cutting-edge development tools
            </p>
          </div>
        </div>
      </section>

      {/* Filter Status */}
      {(activeCategory !== "All" || searchQuery.trim()) && (
        <section className="py-4 bg-vyoniq-gray dark:bg-vyoniq-slate">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text">
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
              </span>
              {activeCategory !== "All" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text">Category:</span>
                  <span className="px-3 py-1 bg-vyoniq-blue/10 dark:bg-vyoniq-green/20 text-vyoniq-blue dark:text-vyoniq-green rounded-full text-sm">
                    {activeCategory}
                  </span>
                </div>
              )}
              {searchQuery.trim() && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text">Search:</span>
                  <span className="px-3 py-1 bg-vyoniq-blue/10 dark:bg-vyoniq-green/20 text-vyoniq-blue dark:text-vyoniq-green rounded-full text-sm">
                    "{searchQuery}"
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  setActiveCategory("All")
                  setSearchQuery("")
                }}
                className="text-sm text-vyoniq-green hover:text-vyoniq-purple transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Blog Content */}
      <section className="py-20 bg-white dark:bg-vyoniq-dark-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="grid md:grid-cols-2 gap-8">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => <BlogCard key={post.slug} post={post} />)
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text">
                      No articles found matching your criteria.
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory("All")
                        setSearchQuery("")
                      }}
                      className="mt-4 text-vyoniq-green hover:text-vyoniq-purple transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <BlogCategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                {/* Featured Posts */}
                <div className="mt-8 p-6 bg-vyoniq-gray dark:bg-vyoniq-slate rounded-lg">
                  <h3 className="text-xl font-bold text-vyoniq-blue dark:text-white mb-4">Featured Posts</h3>
                  <div className="space-y-4">
                    {blogPosts
                      .filter((post) => post.featured)
                      .slice(0, 3)
                      .map((post) => (
                        <div
                          key={post.slug}
                          className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                        >
                          <a
                            href={`/blog/${post.slug}`}
                            className="text-vyoniq-blue dark:text-white hover:text-vyoniq-green transition-colors"
                          >
                            {post.title}
                          </a>
                          <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-muted mt-1">
                            {post.publishDate}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-8 p-6 bg-vyoniq-blue dark:bg-vyoniq-slate rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                  <p className="text-sm mb-4">Get the latest insights delivered directly to your inbox</p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-vyoniq-green"
                    />
                    <button
                      type="submit"
                      className="w-full bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold py-2 rounded-md transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
