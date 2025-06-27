import prisma from "@/lib/prisma";

export interface BlogPost {
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
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
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
    });

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
      tintColor: post.tintColor,
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const post = await prisma.blogPost.findFirst({
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
    });

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
      tintColor: post.tintColor,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
