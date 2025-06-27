import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AdminNewsletterSection } from "@/components/admin-newsletter-section";
import { AdminBlogSection } from "@/components/admin-blog-section";
import { AdminMCPSection } from "@/components/admin-mcp-section";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

async function AdminDashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isAdmin) {
    return redirect("/");
  }

  const waitlistUsers = await prisma.user.findMany({
    where: { isOnWaitlist: true },
    orderBy: { createdAt: "desc" },
  });

  const newsletterSubscribers = await prisma.user.findMany({
    where: { isNewsletterSubscriber: true },
    orderBy: { createdAt: "desc" },
  });

  const newsletters = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch blog statistics
  const totalBlogPosts = await prisma.blogPost.count();
  const publishedBlogPosts = await prisma.blogPost.count({
    where: { published: true },
  });
  const draftBlogPosts = await prisma.blogPost.count({
    where: { published: false },
  });
  const featuredBlogPosts = await prisma.blogPost.count({
    where: { featured: true },
  });

  return (
    <div className="flex min-h-screen flex-col bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-vyoniq-blue dark:text-white">
            Admin Dashboard
          </h1>
          <SignOutButton>
            <Button variant="outline">Log Out</Button>
          </SignOutButton>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Waitlist Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-blue dark:text-white">
                {waitlistUsers.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Newsletter Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-green">
                {newsletterSubscribers.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-blue dark:text-white">
                {totalBlogPosts}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-green">
                {publishedBlogPosts}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {draftBlogPosts}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Featured Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {featuredBlogPosts}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MCP Server Management Section */}
        <div className="mb-8">
          <AdminMCPSection />
        </div>

        {/* Blog Management Section */}
        <div className="mb-8">
          <AdminBlogSection />
        </div>

        {/* Newsletter Management Section */}
        <div className="mb-8">
          <AdminNewsletterSection newsletters={newsletters} />
        </div>

        {/* Data Tables */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vyoniq Apps Waitlist</CardTitle>
              <CardDescription>
                Users who signed up for early access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Signed Up</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlistUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscribers</CardTitle>
              <CardDescription>
                Users who subscribed to the newsletter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsletterSubscribers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
