import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BudgetListClient } from "@/components/budget-list-client";
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
import { ArrowLeft, DollarSign, FileText, Clock } from "lucide-react";
import type { Budget, BudgetItem, Payment } from "@/lib/generated/prisma";

type BudgetWithIncludes = Budget & {
  items: BudgetItem[];
  inquiry: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
  };
  payments: {
    id: string;
    amount: any; // Decimal type
    status: string;
    paidAt: Date | null;
  }[];
};

export default async function BudgetsPage() {
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

  // Fetch user's budgets
  const budgets = (await prisma.budget.findMany({
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
      payments: {
        select: {
          id: true,
          amount: true,
          status: true,
          paidAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as BudgetWithIncludes[];

  // Calculate summary statistics
  const totalBudgets = budgets.length;
  const pendingBudgets = budgets.filter((b) => b.status === "SENT").length;
  const approvedBudgets = budgets.filter((b) => b.status === "APPROVED").length;
  const paidBudgets = budgets.filter(
    (b) => b.status === "PAID" || b.status === "COMPLETED"
  ).length;
  const totalValue = budgets.reduce(
    (sum, budget) => sum + Number(budget.totalAmount),
    0
  );

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
            Your Budgets
          </h1>
          <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
            View and manage all your project budgets and quotes from Vyoniq
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budgets
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
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
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingBudgets}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ready for Payment
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                Paid Projects
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {paidBudgets}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Total Value Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Total Budget Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-vyoniq-blue dark:text-white mb-2">
                ${totalValue.toFixed(2)}
              </div>
              <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                Combined value of all your project budgets
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Budgets List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-vyoniq-blue dark:text-white">
            All Budgets
          </h2>

          {budgets.length > 0 ? (
            <BudgetListClient
              budgets={budgets.map((budget) => ({
                ...budget,
                validUntil: budget.validUntil?.toISOString() || null,
                createdAt: budget.createdAt.toISOString(),
                totalAmount: Number(budget.totalAmount),
                items: budget.items.map((item) => ({
                  ...item,
                  createdAt: item.createdAt.toISOString(),
                  unitPrice: Number(item.unitPrice),
                  totalPrice: Number(item.totalPrice),
                })),
                payments: budget.payments.map((payment) => ({
                  ...payment,
                  paidAt: payment.paidAt?.toISOString() || null,
                })),
              }))}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Budgets Yet</h3>
                  <p className="text-sm mb-6">
                    You don't have any budgets yet. Submit an inquiry to get
                    started with your first project quote.
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
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Having questions about your budgets or payment process?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Budget Process</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Review budget details and breakdown</li>
                  <li>• Approve or request changes</li>
                  <li>• Proceed to secure payment</li>
                  <li>• Project begins once payment is confirmed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Payment & Security</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Secure payments via Stripe</li>
                  <li>• Multiple payment methods accepted</li>
                  <li>• Instant payment confirmation</li>
                  <li>• Full project transparency</li>
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
