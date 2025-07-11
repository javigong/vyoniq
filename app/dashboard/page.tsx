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
  AlertTriangle,
} from "lucide-react";
import { DeleteAccountSection } from "@/components/delete-account-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Force dynamic rendering to avoid static generation issues with auth()
export const dynamic = "force-dynamic";

interface InquiryWithCount {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  _count: {
    messages: number;
  };
}

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
  let inquiries: InquiryWithCount[] = [];
  let user = null;
  let dbError: string | null = null;

  try {
    const { userId } = await auth();

    // Add debug logging for production issues
    console.log("🔍 Dashboard access attempt:", {
      userId: userId ? "present" : "missing",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

    if (!userId) {
      console.log("🚫 No userId found, redirecting to sign-in");
      return redirect("/sign-in");
    }

    // Add logging for DATABASE_URL to check if it's loaded
    const dbUrl = process.env.DATABASE_URL;
    console.log(
      "🔍 DATABASE_URL loaded:",
      dbUrl ? `postgres://...${dbUrl.slice(-10)}` : "Not found"
    );

    // Wrap all database operations in a try...catch block
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.log("👤 Creating new user record for:", userId);
        const clerkUser = await auth();
        user = await prisma.user.create({
          data: {
            id: userId,
            email: (clerkUser.sessionClaims?.email as string) || "",
            name: (clerkUser.sessionClaims?.name as string) || "",
          },
        });
      }

      if (user) {
        inquiries = (await prisma.inquiry.findMany({
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
        })) as InquiryWithCount[];

        const unlinkedInquiries = inquiries.filter(
          (inquiry) => !inquiry.userId
        );
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
      }
    } catch (error) {
      console.error("🔥 Database operation failed:", error);
      dbError =
        "Could not connect to the database or a database error occurred. Please try again later.";
    }

    if (dbError) {
      return (
        <div className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Dashboard Error</AlertTitle>
              <AlertDescription>
                {dbError} If the problem persists, please contact support.
              </AlertDescription>
            </Alert>
          </main>
          <Footer />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                Could not retrieve user profile. Please try signing out and back
                in.
              </AlertDescription>
            </Alert>
          </main>
          <Footer />
        </div>
      );
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
    const resolvedCount = inquiries.filter(
      (i) => i.status === "RESOLVED"
    ).length;

    console.log("✅ Dashboard loaded successfully for user:", userId);

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
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
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
                </div>
              ) : (
                <ul className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <li
                      key={inquiry.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Link
                        href={`/dashboard/inquiries/${inquiry.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-vyoniq-blue dark:text-white">
                            {inquiry.serviceType}
                          </p>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text truncate mb-2">
                          {inquiry.message}
                        </p>
                        <div className="text-xs text-gray-500 flex items-center justify-between">
                          <span>
                            Last updated:{" "}
                            {inquiry.updatedAt.toLocaleDateString()}
                          </span>
                          <span>{inquiry._count.messages} messages</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <DeleteAccountSection />
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    // Enhanced error logging for the entire page component
    console.error("🔥 Critical Dashboard Page Error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Fallback error UI if anything else goes wrong
    return (
      <div className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>An Unexpected Error Occurred</AlertTitle>
            <AlertDescription>
              Something went wrong while loading the dashboard. Please try
              refreshing the page. If the problem persists, contact support.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
}
