import Image from "next/image";
import type { BlogPostFormatted } from "@/lib/blog-utils";

interface BlogAuthorProps {
  author: BlogPostFormatted["author"];
}

export function BlogAuthor({ author }: BlogAuthorProps) {
  return (
    <div className="p-6 bg-vyoniq-gray dark:bg-vyoniq-slate rounded-lg">
      <h3 className="text-xl font-bold text-vyoniq-blue dark:text-white mb-4">
        About the Author
      </h3>
      <div className="flex items-center">
        <div className="relative h-16 w-16 mr-4 flex-shrink-0">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-vyoniq-slate dark:bg-vyoniq-dark-card flex items-center justify-center">
              <span className="text-2xl font-bold text-vyoniq-green">
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-vyoniq-blue dark:text-white">
            {author.name}
          </h4>
          <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text">
            {author.title}
          </p>
        </div>
      </div>
    </div>
  );
}
