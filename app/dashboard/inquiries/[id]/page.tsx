import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Send,
} from "lucide-react";
import { InquiryResponseForm } from "@/components/inquiry-response-form";

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

interface PageParams {
  id: string;
}

interface InquiryWithMessages {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  messages: Array<{
    id: string;
    message: string;
    isFromAdmin: boolean;
    createdAt: Date;
  }>;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return redirect("/sign-in");
  }

  const { id } = await params;

  // Fetch the inquiry with messages
  const inquiry = (await prisma.inquiry.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })) as InquiryWithMessages | null;

  if (!inquiry) {
    notFound();
  }

  // Check if user has access to this inquiry
  const hasAccess = inquiry.userId === userId || inquiry.email === user.email;
  if (!hasAccess) {
    return redirect("/dashboard");
  }

  // Link inquiry to user if not already linked
  if (!inquiry.userId && inquiry.email === user.email) {
    await prisma.inquiry.update({
      where: { id },
      data: { userId: userId },
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

  return (
    <div className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-vyoniq-blue dark:text-white">
              Inquiry Details
            </h1>
            {getStatusBadge(inquiry.status)}
          </div>
        </div>

        {/* Inquiry Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Inquiry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Service Type
                </label>
                <p className="font-medium text-vyoniq-blue dark:text-white">
                  {inquiry.serviceType}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Inquiry ID
                </label>
                <p className="font-mono text-sm">{inquiry.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Submitted
                </label>
                <p>{new Date(inquiry.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </label>
                <p>{new Date(inquiry.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>
              Your conversation with our team about this inquiry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inquiry.messages.map((message: any, index: number) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg ${
                    message.isFromAdmin
                      ? "bg-blue-50 dark:bg-blue-900/20 ml-8"
                      : "bg-gray-50 dark:bg-gray-800 mr-8"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      {message.isFromAdmin ? "Vyoniq Team" : inquiry.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-vyoniq-text dark:text-vyoniq-dark-text whitespace-pre-wrap">
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Form */}
        {inquiry.status !== "CLOSED" && (
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Add a message to continue the conversation with our team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InquiryResponseForm inquiryId={inquiry.id} />
            </CardContent>
          </Card>
        )}

        {inquiry.status === "CLOSED" && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  This inquiry has been closed
                </p>
                <p className="text-sm">
                  If you need further assistance, please submit a new inquiry.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/#contact">Submit New Inquiry</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
