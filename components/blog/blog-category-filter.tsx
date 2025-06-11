"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const categories = [
  "All",
  "Large Language Models",
  "AI Agents",
  "Cursor & AI IDEs",
  "MCP Servers",
  "LLM Integration",
  "AI Development Tools",
  "Case Studies",
  "Industry Trends",
]

interface BlogCategoryFilterProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function BlogCategoryFilter({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: BlogCategoryFilterProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white dark:bg-vyoniq-slate border-gray-200 dark:border-gray-700"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xl font-bold text-vyoniq-blue dark:text-white mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`justify-start px-2 py-1 h-auto w-full ${
                activeCategory === category
                  ? "bg-vyoniq-blue/10 dark:bg-vyoniq-green/20 text-vyoniq-blue dark:text-vyoniq-green"
                  : "text-vyoniq-text dark:text-vyoniq-dark-text hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
