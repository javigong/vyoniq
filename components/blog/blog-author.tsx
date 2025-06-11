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
        <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
          <Image src={author.avatar || "/placeholder.svg"} alt={author.name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-vyoniq-blue dark:text-white">{author.name}</h4>
          <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text">{author.title}</p>
        </div>
      </div>
    </div>
  )
}
