import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-data";

interface BlogRelatedPostsProps {
  posts: BlogPost[];
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group block bg-white dark:bg-vyoniq-dark-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative h-40 w-full">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
            />
            {post.tintColor && (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: post.tintColor }}
              />
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-vyoniq-blue dark:text-white group-hover:text-vyoniq-green transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text mt-2 line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
