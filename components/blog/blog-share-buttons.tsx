"use client";

import { Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export function BlogShareButtons({
  title,
  url,
  description,
}: BlogShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description || title);

  // Updated hashtags for AI agent and MCP focus
  const twitterHashtags = encodeURIComponent(
    [
      "AIAgents",
      "LLM",
      "MCPServers",
      "AgenticAI",
      "AIAutomation",
      "TechInsights",
      "AIInnovation",
    ].join(",")
  );

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${twitterHashtags}&via=vyoniq`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        Share this post:
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("twitter")}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Twitter className="h-4 w-4" />X
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("linkedin")}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("facebook")}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
}
