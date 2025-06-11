"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Link } from "lucide-react"
import { useState } from "react"

interface BlogShareButtonsProps {
  title: string
  slug: string
}

export function BlogShareButtons({ title, slug }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const url = `https://vyoniq.com/blog/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-vyoniq-blue dark:text-white mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-200 dark:border-gray-700"
          onClick={() => window.open(twitterUrl, "_blank")}
        >
          <Twitter className="h-4 w-4" />
          <span>Twitter</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-200 dark:border-gray-700"
          onClick={() => window.open(facebookUrl, "_blank")}
        >
          <Facebook className="h-4 w-4" />
          <span>Facebook</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-200 dark:border-gray-700"
          onClick={() => window.open(linkedinUrl, "_blank")}
        >
          <Linkedin className="h-4 w-4" />
          <span>LinkedIn</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-200 dark:border-gray-700"
          onClick={copyToClipboard}
        >
          <Link className="h-4 w-4" />
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </Button>
      </div>
    </div>
  )
}
