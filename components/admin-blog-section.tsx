"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishDate: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  tintColor?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
}

interface AdminBlogSectionProps {
  initialPosts?: BlogPost[];
}

export function AdminBlogSection({ initialPosts = [] }: AdminBlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "/llms.jpeg",
    publishDate: new Date().toISOString().split("T")[0],
    readTime: 5,
    featured: false,
    published: false,
    tintColor: "",
    categoryIds: [] as string[],
  });

  // Fetch data
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/blog/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        toast.error("Failed to fetch blog posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/blog/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const url = editingPost
        ? `/api/admin/blog/posts/${editingPost.id}`
        : "/api/admin/blog/posts";

      const method = editingPost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newPost = await response.json();
        if (editingPost) {
          setPosts(posts.map((p) => (p.id === editingPost.id ? newPost : p)));
          toast.success("Blog post updated successfully");
          setEditingPost(null);
        } else {
          setPosts([newPost, ...posts]);
          toast.success("Blog post created successfully");
          setShowCreateForm(false);
        }
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save blog post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/blog/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        toast.success("Blog post deleted successfully");
      } else {
        toast.error("Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published: !post.published,
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map((p) => (p.id === post.id ? updatedPost : p)));
        toast.success(
          `Post ${
            updatedPost.published ? "published" : "unpublished"
          } successfully`
        );
      } else {
        toast.error("Failed to update post status");
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      coverImage: "/llms.jpeg",
      publishDate: new Date().toISOString().split("T")[0],
      readTime: 5,
      featured: false,
      published: false,
      tintColor: "",
      categoryIds: [],
    });
  };

  const startEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      publishDate: post.publishDate.split("T")[0],
      readTime: post.readTime,
      featured: post.featured,
      published: post.published,
      tintColor: post.tintColor || "",
      categoryIds: post.categories.map((c) => c.id),
    });
    setEditingPost(post);
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setShowCreateForm(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Blog Management</CardTitle>
              <CardDescription>
                Manage your blog posts and categories
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              disabled={showCreateForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter blog post title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="readTime">Read Time (minutes)</Label>
                      <Input
                        id="readTime"
                        type="number"
                        value={formData.readTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            readTime: parseInt(e.target.value),
                          })
                        }
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      placeholder="Brief description of the blog post"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Full blog post content (Markdown supported)"
                      rows={10}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publishDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="tintColor">Tint Color (optional)</Label>
                      <Input
                        id="tintColor"
                        value={formData.tintColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tintColor: e.target.value,
                          })
                        }
                        placeholder="rgba(14, 165, 233, 0.4)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Featured Post
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            published: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Published
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading
                        ? "Saving..."
                        : editingPost
                        ? "Update Post"
                        : "Create Post"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Posts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading blog posts...
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No blog posts found. Create your first post!
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {post.excerpt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                          >
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          {post.featured && (
                            <Badge variant="outline" className="w-fit">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(post.publishDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {post.categories.map((category) => (
                            <Badge
                              key={category.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePublished(post)}
                          >
                            {post.published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
