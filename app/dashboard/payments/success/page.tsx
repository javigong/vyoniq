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
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, ArrowRight, MessageSquare } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { userId } = await auth();
  const { session_id } = await searchParams;

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return redirect("/sign-in");
  }

  let payment = null;
  let budget = null;

  // If session_id is provided, try to find the payment and budget
  if (session_id) {
    payment = await prisma.payment.findUnique({
      where: { stripeSessionId: session_id },
      include: {
        budget: {
          include: {
            inquiry: {
              select: {
                id: true,
                name: true,
                email: true,
                serviceType: true,
              },
            },
            items: true,
          },
        },
      },
    });

    budget = payment?.budget;
  }

  return (
    <div className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-vyoniq-blue dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
              Thank you for your payment. Your project is now ready to begin!
            </p>
          </div>

          {/* Payment Details */}
          {budget && payment && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Your payment has been processed successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Project
                      </label>
                      <p className="font-medium text-vyoniq-blue dark:text-white">
                        {budget.title}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Service Type
                      </label>
                      <p className="font-medium">
                        {budget.inquiry.serviceType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Amount Paid
                      </label>
                      <p className="font-medium text-green-600">
                        ${Number(payment.amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment Date
                      </label>
                      <p className="font-medium">
                        {payment.paidAt 
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : new Date().toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                  
                  {payment.id && (
                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Payment ID
                      </label>
                      <p className="font-mono text-sm">{payment.id}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
              <CardDescription>
                Here's what to expect now that your payment is confirmed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-vyoniq-blue text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Project Kickoff</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our project manager will contact you within 24 hours to discuss project details and timeline.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-vyoniq-blue text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Regular Updates</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You'll receive regular progress updates and can track everything through your dashboard.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-vyoniq-blue text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Project Delivery</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll deliver your completed project according to the agreed timeline and specifications.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Email Notice */}
          <Card className="mb-8">
            <CardContent className="text-center py-6">
              <div className="text-green-600 mb-2">
                <MessageSquare className="w-6 h-6 mx-auto mb-2" />
              </div>
              <h4 className="font-medium mb-2">Confirmation Email Sent</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We've sent a detailed confirmation email to {user.email} with your payment receipt and next steps.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-vyoniq-blue hover:bg-vyoniq-blue/90">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/dashboard/budgets">
                View All Budgets
              </Link>
            </Button>
            
            {budget && (
              <Button asChild variant="outline">
                <Link href={`/dashboard/inquiries/${budget.inquiry.id}`}>
                  View Project Details
                </Link>
              </Button>
            )}
          </div>

          {/* Support Information */}
          <Card className="mt-8">
            <CardContent className="text-center py-6">
              <h4 className="font-medium mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions about your payment or project, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:support@vyoniq.com">
                    Email Support
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/#contact">
                    Contact Form
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}