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
import { AdminInquirySection } from "@/components/admin-inquiry-section";
import { AdminBudgetSection } from "@/components/admin-budget-section";
import { AdminSubscriptionSection } from "@/components/admin-subscription-section";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering to avoid static generation issues with auth()
export const dynamic = "force-dynamic";

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

  // Fetch inquiry statistics
  const totalInquiries = await prisma.inquiry.count();
  const pendingInquiries = await prisma.inquiry.count({
    where: { status: "PENDING" },
  });
  const inProgressInquiries = await prisma.inquiry.count({
    where: {
      OR: [{ status: "IN_PROGRESS" }, { status: "PAID" }],
    },
  });
  const resolvedInquiries = await prisma.inquiry.count({
    where: { status: "RESOLVED" },
  });

  // Fetch budget statistics
  const totalBudgets = await prisma.budget.count();
  const sentBudgets = await prisma.budget.count({
    where: { status: "SENT" },
  });
  const approvedBudgets = await prisma.budget.count({
    where: { status: "APPROVED" },
  });
  const paidBudgets = await prisma.budget.count({
    where: { status: "PAID" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-vyoniq-blue dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Admin access for:{" "}
              <span className="font-medium">{user.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/dashboard">User Dashboard</Link>
            </Button>
            <SignOutButton>
              <Button variant="outline">Log Out</Button>
            </SignOutButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 mb-8">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-blue dark:text-white">
                {totalInquiries}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingInquiries}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-blue dark:text-white">
                {totalBudgets}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sent Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {sentBudgets}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-green">
                {approvedBudgets}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {paidBudgets}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inquiry Management Section */}
        <div className="mb-8">
          <AdminInquirySection />
        </div>

        {/* Budget Management Section */}
        <div className="mb-8">
          <AdminBudgetSection />
        </div>

        {/* Subscription Management Section */}
        <div className="mb-8">
          <AdminSubscriptionSection />
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
        <div className="grid gap-8 md:grid-cols-1">
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
