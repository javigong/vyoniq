import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  LogOut,
} from "lucide-react";
import { DeleteAccountSection } from "@/components/delete-account-section";

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: MessageSquare,
  RESOLVED: CheckCircle,
  CLOSED: XCircle,
};

export default async function UserDashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  // Get or create user record
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    // Create user record if it doesn't exist
    const clerkUser = await auth();
    user = await prisma.user.create({
      data: {
        id: userId,
        email: (clerkUser.sessionClaims?.email as string) || "",
        name: (clerkUser.sessionClaims?.name as string) || "",
      },
    });
  }

  // Fetch user's inquiries
  const inquiries = await prisma.inquiry.findMany({
    where: {
      OR: [{ userId: userId }, { email: user.email }],
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Link inquiries to user if they aren't already linked
  const unlinkedInquiries = inquiries.filter((inquiry) => !inquiry.userId);
  if (unlinkedInquiries.length > 0) {
    await prisma.inquiry.updateMany({
      where: {
        id: {
          in: unlinkedInquiries.map((inquiry) => inquiry.id),
        },
      },
      data: {
        userId: userId,
      },
    });
  }

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;
  const inProgressCount = inquiries.filter(
    (i) => i.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = inquiries.filter((i) => i.status === "RESOLVED").length;

  return (
    <div className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-vyoniq-blue dark:text-white mb-2">
                Welcome to Your Dashboard
              </h1>
              <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                Track your inquiries, project progress, and manage your Vyoniq
                services.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user.isAdmin && (
                <Button asChild variant="secondary">
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                </Button>
              )}
              <SignOutButton>
                <Button variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-blue dark:text-white">
                {inquiries.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {resolvedCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inquiries Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Inquiries</CardTitle>
                <CardDescription>
                  Track the status of your service requests and conversations
                  with our team.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/#contact">
                  <Plus className="w-4 h-4 mr-2" />
                  New Inquiry
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                  You haven't submitted any inquiries yet.
                </p>
                <Button asChild>
                  <Link href="/#contact">Submit Your First Inquiry</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-vyoniq-slate transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-vyoniq-blue dark:text-white">
                          {inquiry.serviceType}
                        </h3>
                        {getStatusBadge(inquiry.status)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-3 line-clamp-2">
                      {inquiry.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {inquiry._count.messages} messages
                        </span>
                        <span>ID: {inquiry.id.slice(-8)}</span>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/inquiries/${inquiry.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services & Budgets Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Services & Budgets</CardTitle>
            <CardDescription>
              Manage your budgets, payments, and purchased services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-6 border rounded-lg">
                <h3 className="font-semibold text-vyoniq-blue dark:text-white mb-2">
                  Project Budgets
                </h3>
                <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                  View and manage budgets for your projects, approve quotes, and make payments.
                </p>
                <Button asChild>
                  <Link href="/dashboard/budgets">
                    View Budgets
                  </Link>
                </Button>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <h3 className="font-semibold text-vyoniq-blue dark:text-white mb-2">
                  Our Services
                </h3>
                <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
                  Explore our full range of AI-powered development and hosting services.
                </p>
                <Button asChild variant="outline">
                  <Link href="/services">
                    Explore Services
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account Section */}
        <DeleteAccountSection />
      </main>

      <Footer />
    </div>
  );
}
