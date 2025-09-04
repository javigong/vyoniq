"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface BudgetItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

interface Budget {
  id: string;
  title: string;
  description?: string;
  status: "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "EXPIRED";
  totalAmount: number;
  currency: string;
  validUntil?: string;
  clientNotes?: string;
  createdAt: string;
  updatedAt: string;
  inquiry: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
  };
  items: BudgetItem[];
  payments: {
    id: string;
    amount: number;
    status: string;
    paidAt?: string;
  }[];
}

export function UserBudgetSection() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");

      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast({
        title: "Error",
        description: "Failed to load budgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "SENT":
        return "secondary";
      case "DRAFT":
        return "outline";
      case "REJECTED":
        return "destructive";
      case "EXPIRED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 dark:text-green-400";
      case "SENT":
        return "text-blue-600 dark:text-blue-400";
      case "DRAFT":
        return "text-gray-600 dark:text-gray-400";
      case "REJECTED":
        return "text-red-600 dark:text-red-400";
      case "EXPIRED":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const handlePayNow = async (budgetId: string) => {
    setPaymentLoading(budgetId);
    try {
      console.log("Starting payment for budget:", budgetId);

      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budgetId }),
      });

      console.log("Payment response:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Payment error response:", errorData);
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();
      console.log("Checkout session response data:", data);

      const { url: sessionUrl } = data;
      console.log("Checkout session URL:", sessionUrl);

      if (!sessionUrl) {
        throw new Error("No checkout session URL received from server");
      }

      // Redirect to Stripe Checkout
      console.log("Redirecting to:", sessionUrl);
      window.location.href = sessionUrl;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Payment Error",
        description:
          error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleBudgetStatusChange = async (
    budgetId: string,
    newStatus: "APPROVED" | "REJECTED",
    clientNotes?: string
  ) => {
    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          clientNotes: clientNotes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update budget status");
      }

      // Refresh budgets to show updated status
      await fetchBudgets();

      toast({
        title: "Success",
        description: `Budget ${newStatus.toLowerCase()} successfully!`,
      });
    } catch (error) {
      console.error("Error updating budget status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update budget",
        variant: "destructive",
      });
    }
  };

  const isPaid = (budget: Budget) => {
    return budget.payments.some((payment) => payment.status === "SUCCEEDED");
  };

  const getPaymentStatus = (budget: Budget) => {
    const successfulPayment = budget.payments.find(
      (p) => p.status === "SUCCEEDED"
    );
    if (successfulPayment) {
      return `Paid on ${new Date(
        successfulPayment.paidAt!
      ).toLocaleDateString()}`;
    }

    const pendingPayment = budget.payments.find((p) => p.status === "PENDING");
    if (pendingPayment) {
      return "Payment pending...";
    }

    return null;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vyoniq-teal mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Loading budgets...
        </p>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No budgets found. Budgets will appear here once they are created for
          your inquiries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.slice(0, 3).map((budget) => (
        <Card key={budget.id} className="border-l-4 border-l-vyoniq-teal">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-vyoniq-blue dark:text-white">
                  {budget.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Related to: {budget.inquiry.serviceType}
                </p>
              </div>
              <div className="text-right">
                <Badge variant={getStatusBadgeVariant(budget.status)}>
                  {budget.status}
                </Badge>
                <p className="text-lg font-bold text-vyoniq-blue dark:text-white mt-1">
                  {formatCurrency(budget.totalAmount, budget.currency)}
                </p>
              </div>
            </div>

            {budget.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {budget.description}
              </p>
            )}

            {/* Budget Items */}
            <div className="mb-3">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                Items ({budget.items.length}):
              </h4>
              <div className="space-y-1">
                {budget.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} ({item.quantity}x)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.totalPrice, budget.currency)}
                    </span>
                  </div>
                ))}
                {budget.items.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    ... and {budget.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>

            {/* Payment Status and Actions */}
            <div className="flex justify-between items-center">
              <div>
                {isPaid(budget) ? (
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      ✓ Paid
                    </Badge>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {getPaymentStatus(budget)}
                    </span>
                  </div>
                ) : getPaymentStatus(budget) ? (
                  <Badge variant="secondary">Payment Pending</Badge>
                ) : budget.status === "APPROVED" ? (
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    Payment required
                  </span>
                ) : (
                  <span className={`text-sm ${getStatusColor(budget.status)}`}>
                    {budget.status === "SENT" && "Awaiting your approval"}
                    {budget.status === "DRAFT" && "In preparation"}
                    {budget.status === "REJECTED" && "Declined"}
                    {budget.status === "EXPIRED" && "Expired"}
                  </span>
                )}

                {budget.validUntil && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Valid until:{" "}
                    {new Date(budget.validUntil).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {budget.status === "APPROVED" && !isPaid(budget) && (
                  <Button
                    onClick={() => handlePayNow(budget.id)}
                    disabled={paymentLoading === budget.id}
                    className="bg-vyoniq-purple hover:bg-vyoniq-purple/90 text-white"
                  >
                    {paymentLoading === budget.id ? "Processing..." : "Pay Now"}
                  </Button>
                )}

                {budget.status === "SENT" && (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleBudgetStatusChange(budget.id, "APPROVED")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleBudgetStatusChange(budget.id, "REJECTED")
                      }
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {budget.clientNotes && (
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Your notes:</strong> {budget.clientNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {budgets.length > 3 && (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          And {budgets.length - 3} more budget
          {budgets.length - 3 !== 1 ? "s" : ""}...
        </div>
      )}
    </div>
  );
}
