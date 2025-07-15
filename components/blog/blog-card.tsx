import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";
import type { BlogPostFormatted } from "@/lib/blog-utils";

interface BlogCardProps {
  post: BlogPostFormatted;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden bg-vyoniq-gray dark:bg-vyoniq-dark-card border-vyoniq-slate/20 dark:border-vyoniq-slate/10 h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          )}
          {post.tintColor && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: post.tintColor }}
            />
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="bg-vyoniq-blue/10 dark:bg-vyoniq-green/20 text-vyoniq-blue dark:text-vyoniq-green hover:bg-vyoniq-blue/20 dark:hover:bg-vyoniq-green/30"
              >
                {category}
              </Badge>
            ))}
          </div>
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold text-vyoniq-blue dark:text-white mb-2 hover:text-vyoniq-green transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-vyoniq-text dark:text-vyoniq-dark-muted">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
