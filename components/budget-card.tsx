"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Clock, CheckCircle, XCircle, CreditCard, Calendar, FileText } from "lucide-react";
import { getStripe } from "@/lib/stripe";

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
  totalAmount: number;
  status: string;
  validUntil?: string;
  adminNotes?: string;
  clientNotes?: string;
  createdAt: string;
  items: BudgetItem[];
  inquiry: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
  };
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    paidAt?: string;
  }>;
}

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  EXPIRED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  COMPLETED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const statusIcons = {
  DRAFT: Clock,
  SENT: DollarSign,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  EXPIRED: Clock,
  PAID: CheckCircle,
  COMPLETED: CheckCircle,
};

interface BudgetCardProps {
  budget: Budget;
  onStatusUpdate?: () => void;
}

export function BudgetCard({ budget, onStatusUpdate }: BudgetCardProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [clientNotes, setClientNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status as keyof typeof statusIcons];
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const updateBudgetStatus = async (status: "APPROVED" | "REJECTED", notes?: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/budgets/${budget.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          clientNotes: notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update budget status");
      }

      toast({
        title: "Success",
        description: `Budget ${status.toLowerCase()} successfully`,
      });

      setIsApproveDialogOpen(false);
      setIsRejectDialogOpen(false);
      setClientNotes("");
      onStatusUpdate?.();
    } catch (error) {
      console.error("Error updating budget status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update budget status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsPaymentLoading(true);

    try {
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budgetId: budget.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment session");
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const isExpired = budget.validUntil && new Date() > new Date(budget.validUntil);
  const canApprove = budget.status === "SENT" && !isExpired;
  const canPay = budget.status === "APPROVED" && !isExpired;
  const hasPaidPayment = budget.payments.some(p => p.status === "SUCCEEDED");

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{budget.title}</CardTitle>
            <CardDescription className="mt-2">
              {budget.description}
            </CardDescription>
          </div>
          <div className="text-right">
            {getStatusBadge(budget.status)}
            <div className="text-2xl font-bold text-vyoniq-blue dark:text-white mt-2">
              ${Number(budget.totalAmount).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            Created: {new Date(budget.createdAt).toLocaleDateString()}
          </div>
          {budget.validUntil && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              Valid until: {new Date(budget.validUntil).toLocaleDateString()}
              {isExpired && <span className="ml-2 text-red-500">(Expired)</span>}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FileText className="w-4 h-4 mr-2" />
            Service: {budget.inquiry.serviceType}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Budget Items */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Budget Breakdown</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budget.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500">{item.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.category && (
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">${Number(item.unitPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${Number(item.totalPrice).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Admin Notes */}
        {budget.adminNotes && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Notes from Vyoniq Team
            </h5>
            <p className="text-blue-800 dark:text-blue-300 text-sm whitespace-pre-wrap">
              {budget.adminNotes}
            </p>
          </div>
        )}

        {/* Client Notes */}
        {budget.clientNotes && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h5 className="font-medium mb-2">Your Notes</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {budget.clientNotes}
            </p>
          </div>
        )}

        {/* Payment Information */}
        {budget.payments.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h5 className="font-medium text-green-900 dark:text-green-300 mb-2">
              Payment Information
            </h5>
            {budget.payments.map((payment) => (
              <div key={payment.id} className="text-sm text-green-800 dark:text-green-300">
                Payment of ${Number(payment.amount).toFixed(2)} - {payment.status}
                {payment.paidAt && (
                  <span className="ml-2">
                    on {new Date(payment.paidAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {canApprove && (
            <>
              <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-vyoniq-green hover:bg-vyoniq-green/90">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Budget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Budget</DialogTitle>
                    <DialogDescription>
                      You're about to approve this budget. Once approved, you can proceed with payment.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="approve-notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="approve-notes"
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Any additional comments or questions..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsApproveDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => updateBudgetStatus("APPROVED", clientNotes)}
                        disabled={isLoading}
                        className="bg-vyoniq-green hover:bg-vyoniq-green/90"
                      >
                        {isLoading ? "Approving..." : "Approve Budget"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Changes</DialogTitle>
                    <DialogDescription>
                      Let us know what changes you'd like to see in this budget.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reject-notes">Feedback and Change Requests *</Label>
                      <Textarea
                        id="reject-notes"
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Please describe what you'd like to change..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsRejectDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => updateBudgetStatus("REJECTED", clientNotes)}
                        disabled={isLoading || !clientNotes.trim()}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {isLoading ? "Submitting..." : "Request Changes"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          {canPay && !hasPaidPayment && (
            <Button 
              onClick={handlePayment}
              disabled={isPaymentLoading}
              className="bg-vyoniq-purple hover:bg-vyoniq-purple/90"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isPaymentLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          )}

          {budget.status === "REJECTED" && (
            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
              <strong>Waiting for Updates:</strong> We're working on the changes you requested.
            </div>
          )}

          {isExpired && budget.status === "SENT" && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              <strong>Expired:</strong> This budget has expired. Please contact us for an updated quote.
            </div>
          )}

          {budget.status === "PAID" && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <strong>Payment Confirmed:</strong> Your project will begin shortly!
            </div>
          )}

          {budget.status === "COMPLETED" && (
            <div className="text-sm text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
              <strong>Project Completed:</strong> Thank you for choosing Vyoniq!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}