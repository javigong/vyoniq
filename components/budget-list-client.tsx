"use client";

import { useRouter } from "next/navigation";
import { BudgetCard } from "./budget-card";

interface BudgetItem {
  id: string;
  name: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string | null;
  createdAt: string;
  budgetId: string;
  servicePricingId?: string | null;
  isCustom: boolean;
}

interface Budget {
  id: string;
  title: string;
  description?: string | null;
  totalAmount: number;
  status: string;
  validUntil?: string | null;
  adminNotes?: string | null;
  clientNotes?: string | null;
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
    paidAt?: string | null;
  }>;
}

interface BudgetListClientProps {
  budgets: Budget[];
}

export function BudgetListClient({ budgets }: BudgetListClientProps) {
  const router = useRouter();

  const handleStatusUpdate = () => {
    // Use router.refresh() instead of window.location.reload() for better UX
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
  );
}
