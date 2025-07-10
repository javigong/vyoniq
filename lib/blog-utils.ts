import prisma from "@/lib/prisma";
import type {
  BlogPost,
  BlogAuthor,
  BlogCategory,
  BlogPostCategory,
} from "@/lib/generated/prisma";

type BlogPostWithIncludes = BlogPost & {
  author: BlogAuthor;
  categories: (BlogPostCategory & {
    category: BlogCategory;
  })[];
};

export interface BlogPostFormatted {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishDate: string;
  readTime: number;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  categories: string[];
  featured: boolean;
  tintColor?: string;
}

// Direct database access for build-time and server-side operations
export async function getBlogPosts(): Promise<BlogPostFormatted[]> {
  try {
    const posts = (await prisma.blogPost.findMany({
      where: { published: true },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
    })) as BlogPostWithIncludes[];

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishDate: post.publishDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: post.readTime,
      author: {
        name: post.author.name,
        avatar: post.author.avatar || "",
        title: post.author.title,
      },
      categories: post.categories.map((pc) => pc.category.name),
      featured: post.featured,
      tintColor: post.tintColor || undefined,
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostFormatted | null> {
  try {
    const post = (await prisma.blogPost.findFirst({
      where: {
        slug: slug,
        published: true,
      },
      include: {
        author: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })) as BlogPostWithIncludes | null;

    if (!post) {
      return null;
    }

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishDate: post.publishDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime: post.readTime,
      author: {
        name: post.author.name,
        avatar: post.author.avatar || "",
        title: post.author.title,
      },
      categories: post.categories.map((pc) => pc.category.name),
      featured: post.featured,
      tintColor: post.tintColor || undefined,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
