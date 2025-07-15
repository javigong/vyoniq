import Image from "next/image";
import Link from "next/link";
import type { BlogPostFormatted } from "@/lib/blog-utils";
import { Card, CardContent } from "@/components/ui/card";

interface BlogRelatedPostsProps {
  posts: BlogPostFormatted[];
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Card
          key={post.slug}
          className="overflow-hidden bg-vyoniq-gray dark:bg-vyoniq-dark-card border-vyoniq-slate/20 dark:border-vyoniq-slate/10"
        >
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative h-40 w-full">
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h4 className="font-bold text-vyoniq-blue dark:text-white mb-2 hover:text-vyoniq-green transition-colors">
                {post.title}
              </h4>
              <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
