"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { RefreshCw, Calendar, Pause } from "lucide-react";

interface SubscriptionItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

interface Subscription {
  id: string;
  title: string;
  description?: string;
  monthlyAmount: number;
  currency: string;
  status:
    | "DRAFT"
    | "SENT"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED"
    | "ACTIVE"
    | "CANCELLED"
    | "PAST_DUE"
    | "COMPLETED";
  billingInterval: string;
  trialPeriodDays?: number;
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
  items: SubscriptionItem[];
  subscriptions: {
    id: string;
    amount: number;
    status: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    nextBillingDate?: string;
  }[];
}

export function UserSubscriptionSection() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      if (!response.ok) throw new Error("Failed to fetch subscriptions");

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "SENT":
        return "secondary";
      case "APPROVED":
        return "default";
      case "DRAFT":
        return "outline";
      case "REJECTED":
        return "destructive";
      case "EXPIRED":
        return "destructive";
      case "CANCELLED":
        return "destructive";
      case "PAST_DUE":
        return "destructive";
      case "COMPLETED":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 dark:text-green-400";
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
      case "CANCELLED":
        return "text-red-600 dark:text-red-400";
      case "PAST_DUE":
        return "text-orange-600 dark:text-orange-400";
      case "COMPLETED":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const handleSubscribeNow = async (subscriptionId: string) => {
    setPaymentLoading(subscriptionId);
    try {
      console.log("Starting subscription for:", subscriptionId);

      const response = await fetch(
        "/api/subscriptions/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscriptionId }),
        }
      );

      console.log("Subscription response:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Subscription error response:", errorData);
        throw new Error(
          errorData.error || "Failed to create subscription checkout session"
        );
      }

      const data = await response.json();
      console.log("Subscription checkout response data:", data);

      const { url: sessionUrl } = data;
      console.log("Subscription checkout URL:", sessionUrl);

      if (!sessionUrl) {
        throw new Error("No checkout session URL received from server");
      }

      // Redirect to Stripe Checkout
      console.log("Redirecting to:", sessionUrl);
      window.location.href = sessionUrl;
    } catch (error) {
      console.error("Error creating subscription checkout session:", error);
      toast({
        title: "Subscription Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleSubscriptionStatusChange = async (
    subscriptionId: string,
    newStatus: "APPROVED" | "REJECTED",
    clientNotes?: string
  ) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
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
        throw new Error(
          errorData.error || "Failed to update subscription status"
        );
      }

      // Refresh subscriptions to show updated status
      await fetchSubscriptions();

      toast({
        title: "Success",
        description: `Subscription ${newStatus.toLowerCase()} successfully!`,
      });
    } catch (error) {
      console.error("Error updating subscription status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const isActive = (subscription: Subscription) => {
    // Check if subscription status is ACTIVE OR if there are active payments
    return (
      subscription.status === "ACTIVE" ||
      subscription.subscriptions.some((payment) => payment.status === "ACTIVE")
    );
  };

  const getSubscriptionStatus = (subscription: Subscription) => {
    // First check if subscription itself is ACTIVE
    if (subscription.status === "ACTIVE") {
      const activePayment = subscription.subscriptions.find(
        (p) => p.status === "ACTIVE"
      );
      if (activePayment && activePayment.nextBillingDate) {
        const nextBilling = new Date(
          activePayment.nextBillingDate
        ).toLocaleDateString();
        return `Active - Next billing: ${nextBilling}`;
      }
      return "Active";
    }

    // Then check payment statuses
    const activePayment = subscription.subscriptions.find(
      (p) => p.status === "ACTIVE"
    );
    if (activePayment) {
      const nextBilling = activePayment.nextBillingDate
        ? new Date(activePayment.nextBillingDate).toLocaleDateString()
        : "Unknown";
      return `Active - Next billing: ${nextBilling}`;
    }

    const pastDuePayment = subscription.subscriptions.find(
      (p) => p.status === "PAST_DUE"
    );
    if (pastDuePayment) {
      return "Payment past due";
    }

    return null;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vyoniq-teal mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Loading subscriptions...
        </p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No subscriptions found. Subscriptions will appear here once they are
          created for your inquiries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.slice(0, 3).map((subscription) => (
        <Card
          key={subscription.id}
          className="border-l-4 border-l-vyoniq-purple"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-vyoniq-blue dark:text-white">
                  {subscription.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Related to: {subscription.inquiry.serviceType}
                </p>
              </div>
              <div className="text-right">
                <Badge variant={getStatusBadgeVariant(subscription.status)}>
                  {subscription.status}
                </Badge>
                <p className="text-lg font-bold text-vyoniq-blue dark:text-white mt-1">
                  {formatCurrency(
                    subscription.monthlyAmount,
                    subscription.currency
                  )}
                  <span className="text-sm font-normal text-gray-500">
                    /{subscription.billingInterval}
                  </span>
                </p>
              </div>
            </div>

            {subscription.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {subscription.description}
              </p>
            )}

            {/* Subscription Items */}
            <div className="mb-3">
              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                Services ({subscription.items.length}):
              </h4>
              <div className="space-y-1">
                {subscription.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} ({item.quantity}x)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.totalPrice, subscription.currency)}
                    </span>
                  </div>
                ))}
                {subscription.items.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    ... and {subscription.items.length - 3} more services
                  </p>
                )}
              </div>
            </div>

            {/* Trial Period Info */}
            {subscription.trialPeriodDays > 0 && (
              <div className="mb-3">
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {subscription.trialPeriodDays} day trial period
                </Badge>
              </div>
            )}

            {/* Subscription Status and Actions */}
            <div className="flex justify-between items-center">
              <div>
                {isActive(subscription) ? (
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {getSubscriptionStatus(subscription)}
                    </span>
                  </div>
                ) : getSubscriptionStatus(subscription) ? (
                  <Badge variant="destructive">
                    <Pause className="w-3 h-3 mr-1" />
                    {getSubscriptionStatus(subscription)}
                  </Badge>
                ) : subscription.status === "APPROVED" ? (
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    Subscription required
                  </span>
                ) : (
                  <span
                    className={`text-sm ${getStatusColor(subscription.status)}`}
                  >
                    {subscription.status === "SENT" && "Awaiting your approval"}
                    {subscription.status === "DRAFT" && "In preparation"}
                    {subscription.status === "REJECTED" && "Declined"}
                    {subscription.status === "EXPIRED" && "Expired"}
                    {subscription.status === "CANCELLED" && "Cancelled"}
                  </span>
                )}

                {subscription.validUntil && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Valid until:{" "}
                    {new Date(subscription.validUntil).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {subscription.status === "APPROVED" &&
                  !isActive(subscription) && (
                    <Button
                      onClick={() => handleSubscribeNow(subscription.id)}
                      disabled={paymentLoading === subscription.id}
                      className="bg-vyoniq-purple hover:bg-vyoniq-purple/90 text-white"
                    >
                      {paymentLoading === subscription.id
                        ? "Processing..."
                        : "Subscribe Now"}
                    </Button>
                  )}

                {subscription.status === "SENT" && (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSubscriptionStatusChange(
                          subscription.id,
                          "APPROVED"
                        )
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleSubscriptionStatusChange(
                          subscription.id,
                          "REJECTED"
                        )
                      }
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {subscription.clientNotes && (
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Your notes:</strong> {subscription.clientNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {subscriptions.length > 3 && (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          And {subscriptions.length - 3} more subscription
          {subscriptions.length - 3 !== 1 ? "s" : ""}...
        </div>
      )}
    </div>
  );
}
