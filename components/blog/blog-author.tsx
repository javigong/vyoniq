import Image from "next/image"
import type { BlogPost } from "@/lib/blog-data"

interface BlogAuthorProps {
  author: BlogPost["author"]
}

export function BlogAuthor({ author }: BlogAuthorProps) {
  return (
    <div className="p-6 bg-vyoniq-gray dark:bg-vyoniq-slate rounded-lg">
      <h3 className="text-xl font-bold text-vyoniq-blue dark:text-white mb-4">About the Author</h3>
      <div className="flex items-center">
        <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 bg-vyoniq-blue/10 dark:bg-vyoniq-green/20 flex items-center justify-center">
          {author.avatar && author.avatar !== "/placeholder.svg?height=100&width=100&text=JG" ? (
            <Image src={author.avatar || "/placeholder.svg"} alt={author.name} fill className="object-cover" />
          ) : (
            <span className="text-2xl font-bold text-vyoniq-blue dark:text-vyoniq-green">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-bold text-vyoniq-blue dark:text-white">{author.name}</h4>
          <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text">{author.title}</p>
        </div>
      </div>
    </div>
  )
}
