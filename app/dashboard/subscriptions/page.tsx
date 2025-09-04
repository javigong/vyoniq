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
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, RefreshCw, FileText, Clock, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type {
  Subscription,
  SubscriptionItem,
  SubscriptionPayment,
} from "@/lib/generated/prisma";

type SubscriptionWithIncludes = Subscription & {
  items: SubscriptionItem[];
  inquiry: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
  };
  subscriptions: {
    id: string;
    amount: any; // Decimal type
    status: string;
    currentPeriodStart?: Date | null;
    currentPeriodEnd?: Date | null;
    nextBillingDate?: Date | null;
  }[];
};

export default async function SubscriptionsPage() {
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

  // Fetch user's subscriptions
  const subscriptions = (await prisma.subscription.findMany({
    where: {
      inquiry: {
        OR: [{ userId: userId }, { email: user.email }],
      },
    },
    include: {
      items: true,
      inquiry: {
        select: {
          id: true,
          name: true,
          email: true,
          serviceType: true,
        },
      },
      subscriptions: {
        select: {
          id: true,
          amount: true,
          status: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          nextBillingDate: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as SubscriptionWithIncludes[];

  // Calculate summary statistics
  const totalSubscriptions = subscriptions.length;
  const pendingSubscriptions = subscriptions.filter(
    (s) => s.status === "SENT"
  ).length;
  const approvedSubscriptions = subscriptions.filter(
    (s) => s.status === "APPROVED"
  ).length;
  const activeSubscriptions = subscriptions.filter(
    (s) =>
      s.status === "ACTIVE" ||
      s.subscriptions.some((p) => p.status === "ACTIVE")
  ).length;

  // Determine billing intervals to show appropriate totals
  const billingIntervals = subscriptions.map((s) => s.billingInterval);
  const hasMonthly = billingIntervals.includes("month");
  const hasYearly = billingIntervals.includes("year");
  const isMixed = hasMonthly && hasYearly;
  const hasSubscriptions = subscriptions.length > 0;

  // Calculate appropriate total value based on billing intervals
  const totalMonthlyValue = subscriptions.reduce(
    (sum, subscription) => sum + Number(subscription.monthlyAmount),
    0
  );

  // For yearly subscriptions, we want to show the actual yearly amount
  // which should be the sum of all subscription items (the real charged amount)
  const totalYearlyValue = subscriptions.reduce((sum, subscription) => {
    if (subscription.billingInterval === "year") {
      // Sum up the actual items for yearly subscriptions
      const subscriptionTotal = subscription.items.reduce(
        (itemSum, item) => itemSum + Number(item.totalPrice),
        0
      );
      return sum + subscriptionTotal;
    } else {
      // For monthly subscriptions, convert to yearly
      return sum + Number(subscription.monthlyAmount) * 12;
    }
  }, 0);

  // Determine what to display
  const displayValue = isMixed
    ? totalMonthlyValue // Show monthly equivalent for mixed
    : hasYearly
    ? totalYearlyValue
    : totalMonthlyValue;

  const displayInterval = isMixed
    ? "monthly (equivalent)"
    : hasYearly
    ? "yearly"
    : "monthly";

  const displayTitle = !hasSubscriptions
    ? "Total Value"
    : isMixed
    ? "Total Monthly Equivalent Value"
    : hasYearly
    ? "Total Yearly Value"
    : "Total Monthly Value";

  const displayDescription = !hasSubscriptions
    ? "No subscriptions to display"
    : isMixed
    ? "Combined monthly equivalent value of all your subscriptions"
    : hasYearly
    ? "Combined yearly value of all your subscriptions"
    : "Combined monthly value of all your subscriptions";

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

          <h1 className="text-3xl font-bold text-vyoniq-blue dark:text-white mb-2">
            Your Subscriptions
          </h1>
          <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
            View and manage all your recurring service subscriptions from Vyoniq
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Subscriptions
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-blue dark:text-white">
                {totalSubscriptions}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingSubscriptions}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ready to Subscribe
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-vyoniq-green">
                {approvedSubscriptions}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Subscriptions
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {activeSubscriptions}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total Value Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">{displayTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-vyoniq-blue dark:text-white mb-2">
                ${displayValue.toFixed(2)}
              </div>
              <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                {displayDescription}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-vyoniq-blue dark:text-white">
            All Subscriptions
          </h2>

          {subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription) => {
                const isActive = subscription.subscriptions.some(
                  (p) => p.status === "ACTIVE"
                );
                const activePayment = subscription.subscriptions.find(
                  (p) => p.status === "ACTIVE"
                );

                return (
                  <Card
                    key={subscription.id}
                    className="border-l-4 border-l-vyoniq-purple"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white">
                            {subscription.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Service: {subscription.inquiry.serviceType}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              isActive
                                ? "default"
                                : subscription.status === "SENT"
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : ""
                            }
                          >
                            {isActive ? "ACTIVE" : subscription.status}
                          </Badge>
                          <p className="text-2xl font-bold text-vyoniq-blue dark:text-white mt-1">
                            {formatCurrency(
                              Number(subscription.monthlyAmount),
                              subscription.currency
                            )}
                            <span className="text-sm font-normal text-gray-500">
                              /{subscription.billingInterval}
                            </span>
                          </p>
                        </div>
                      </div>

                      {subscription.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {subscription.description}
                        </p>
                      )}

                      {/* Subscription Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Billing Interval
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {subscription.billingInterval === "year"
                              ? "Yearly"
                              : "Monthly"}
                          </p>
                        </div>

                        {subscription.trialPeriodDays &&
                          subscription.trialPeriodDays > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Trial Period
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {subscription.trialPeriodDays} days
                              </p>
                            </div>
                          )}

                        {activePayment?.nextBillingDate && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Next Billing
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(
                                activePayment.nextBillingDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Subscription Items */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                          Included Services ({subscription.items.length}):
                        </h4>
                        <div className="space-y-2">
                          {subscription.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <div>
                                <span className="font-medium">{item.name}</span>
                                {item.description && (
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="font-medium">
                                  {formatCurrency(
                                    Number(item.totalPrice),
                                    subscription.currency
                                  )}
                                </span>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-gray-500">
                                    {item.quantity} ×{" "}
                                    {formatCurrency(
                                      Number(item.unitPrice),
                                      subscription.currency
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Current Period Info */}
                      {activePayment && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Current Billing Period
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {activePayment.currentPeriodStart &&
                            activePayment.currentPeriodEnd ? (
                              <>
                                {new Date(
                                  activePayment.currentPeriodStart
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  activePayment.currentPeriodEnd
                                ).toLocaleDateString()}
                              </>
                            ) : (
                              "Active subscription"
                            )}
                          </p>
                        </div>
                      )}

                      {subscription.validUntil && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                          Offer valid until:{" "}
                          {new Date(
                            subscription.validUntil
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {subscription.clientNotes && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Your notes:</strong>{" "}
                            {subscription.clientNotes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No Subscriptions Yet
                  </h3>
                  <p className="text-sm mb-6">
                    You don't have any subscriptions yet. Submit an inquiry to
                    get started with your first recurring service.
                  </p>
                  <Button asChild>
                    <Link href="/#contact">Submit New Inquiry</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help with Subscriptions?</CardTitle>
            <CardDescription>
              Having questions about your subscriptions or billing process?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Subscription Process</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Review subscription details and pricing</li>
                  <li>• Approve or request changes</li>
                  <li>• Set up recurring payments</li>
                  <li>• Services begin immediately after setup</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Billing & Management</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Secure recurring payments via Stripe</li>
                  <li>• Monthly or yearly billing options</li>
                  <li>• Trial periods available on select services</li>
                  <li>• Cancel or modify anytime</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Questions? Contact us at{" "}
                <a
                  href="mailto:support@vyoniq.com"
                  className="text-vyoniq-blue hover:underline"
                >
                  support@vyoniq.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
