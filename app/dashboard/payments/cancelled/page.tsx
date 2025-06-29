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
import { XCircle, ArrowLeft, CreditCard, MessageSquare } from "lucide-react";

export default async function PaymentCancelledPage() {
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

  return (
    <div className="min-h-screen bg-vyoniq-gray dark:bg-vyoniq-dark-bg">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Cancellation Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-vyoniq-blue dark:text-white mb-2">
              Payment Cancelled
            </h1>
            <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>

          {/* What Happened */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What Happened?</CardTitle>
              <CardDescription>
                Your payment process was interrupted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You chose to cancel the payment process before it was completed. This could have happened for several reasons:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 ml-4">
                  <li>• You decided to review the budget again</li>
                  <li>• You encountered an issue with your payment method</li>
                  <li>• You want to discuss the project details first</li>
                  <li>• You accidentally closed the payment window</li>
                </ul>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Don't worry!</strong> Your budget is still available and you can try the payment process again at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What Would You Like to Do?</CardTitle>
              <CardDescription>
                Choose your next step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button asChild className="h-auto p-4">
                    <Link href="/dashboard/budgets" className="flex flex-col items-center space-y-2">
                      <CreditCard className="w-6 h-6" />
                      <span className="font-medium">Try Payment Again</span>
                      <span className="text-xs text-center opacity-80">
                        Return to your budgets and complete payment
                      </span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" asChild className="h-auto p-4">
                    <Link href="/#contact" className="flex flex-col items-center space-y-2">
                      <MessageSquare className="w-6 h-6" />
                      <span className="font-medium">Contact Us</span>
                      <span className="text-xs text-center opacity-80">
                        Have questions? Let's discuss your project
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Common Payment Issues</CardTitle>
              <CardDescription>
                Need help with payment problems?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Payment Method Issues</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• Ensure your card has sufficient funds</li>
                    <li>• Check that your billing address is correct</li>
                    <li>• Try a different payment method</li>
                    <li>• Contact your bank if the card is being declined</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Browser Issues</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• Disable ad blockers temporarily</li>
                    <li>• Clear your browser cache and cookies</li>
                    <li>• Try using a different browser</li>
                    <li>• Ensure JavaScript is enabled</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Security Features</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                    <li>• Complete any 3D Secure verification</li>
                    <li>• Check for SMS verification codes</li>
                    <li>• Temporarily disable VPN if using one</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Security */}
          <Card className="mb-8">
            <CardContent className="text-center py-6">
              <div className="text-vyoniq-blue mb-2">
                <CreditCard className="w-6 h-6 mx-auto mb-2" />
              </div>
              <h4 className="font-medium mb-2">Secure Payments with Stripe</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All payments are processed securely through Stripe. Your payment information is never stored on our servers.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard/budgets">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Budgets
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Support Information */}
          <Card className="mt-8">
            <CardContent className="text-center py-6">
              <h4 className="font-medium mb-2">Still Need Help?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our team is here to help you complete your payment and get your project started.
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