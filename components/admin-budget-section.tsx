"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  UserPlus,
} from "lucide-react";
import { z } from "zod";

interface BudgetItem {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category?: string;
  servicePricingId?: string;
  isCustom: boolean;
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
  inquiry: {
    id: string;
    name: string;
    email: string;
    serviceType: string;
  };
  items: BudgetItem[];
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    paidAt?: string;
  }>;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  status: string;
  createdAt: string;
}

interface ServicePricing {
  id: string;
  serviceType: string;
  name: string;
  description: string;
  basePrice: number;
  billingType: string;
  features: string[];
}

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  SENT: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  EXPIRED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  COMPLETED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
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

export function AdminBudgetSection() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [servicePricing, setServicePricing] = useState<ServicePricing[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<string>("");
  const [isStandalone, setIsStandalone] = useState(false);
  const [standaloneClientForm, setStandaloneClientForm] = useState({
    clientName: "",
    clientEmail: "",
    serviceType: "",
    inquiryMessage: "",
  });
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      category: "",
      isCustom: true,
    },
  ]);
  const [budgetForm, setBudgetForm] = useState({
    title: "",
    description: "",
    validUntil: "",
    adminNotes: "",
    currency: "USD" as "USD" | "CAD",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchBudgets();
    fetchInquiries();
    fetchServicePricing();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (response.ok) {
        const data = await response.json();
        setBudgets(data.budgets);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const fetchInquiries = async () => {
    try {
      const response = await fetch(
        "/api/inquiries?status=PENDING,IN_PROGRESS,PAID"
      );
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  const fetchServicePricing = async () => {
    try {
      const response = await fetch("/api/service-pricing?isActive=true");
      if (response.ok) {
        const data = await response.json();
        setServicePricing(data.servicePricing);
      }
    } catch (error) {
      console.error("Error fetching service pricing:", error);
    }
  };

  const addBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      {
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        category: "",
        isCustom: true,
      },
    ]);
  };

  const removeBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const updateBudgetItem = (
    index: number,
    field: keyof BudgetItem,
    value: any
  ) => {
    const updatedItems = [...budgetItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setBudgetItems(updatedItems);
  };

  const addServicePricingItem = (serviceId: string) => {
    const service = servicePricing.find((s) => s.id === serviceId);
    if (service) {
      setBudgetItems([
        ...budgetItems,
        {
          name: service.name,
          description: service.description,
          quantity: 1,
          unitPrice: Number(service.basePrice),
          category: service.serviceType,
          servicePricingId: service.id,
          isCustom: false,
        },
      ]);
    }
  };

  const calculateTotal = () => {
    return budgetItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiEndpoint = isStandalone
        ? "/api/budgets/standalone"
        : "/api/budgets";

      let requestBody;
      if (isStandalone) {
        requestBody = {
          clientName: standaloneClientForm.clientName,
          clientEmail: standaloneClientForm.clientEmail,
          serviceType: standaloneClientForm.serviceType,
          inquiryMessage: standaloneClientForm.inquiryMessage || undefined,
          title: budgetForm.title,
          description: budgetForm.description,
          validUntil: budgetForm.validUntil || undefined,
          adminNotes: budgetForm.adminNotes,
          currency: budgetForm.currency,
          items: budgetItems.filter((item) => item.name && item.unitPrice > 0),
        };
      } else {
        requestBody = {
          inquiryId: selectedInquiry,
          title: budgetForm.title,
          description: budgetForm.description,
          validUntil: budgetForm.validUntil || undefined,
          adminNotes: budgetForm.adminNotes,
          currency: budgetForm.currency,
          items: budgetItems.filter((item) => item.name && item.unitPrice > 0),
        };
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create budget");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: data.message || "Budget created successfully",
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchBudgets();
    } catch (error) {
      console.error("Error creating budget:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create budget",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setBudgetForm({
      title: "",
      description: "",
      validUntil: "",
      adminNotes: "",
      currency: "USD",
    });
    setBudgetItems([
      {
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        category: "",
        isCustom: true,
      },
    ]);
    setSelectedInquiry("");
    setIsStandalone(false);
    setStandaloneClientForm({
      clientName: "",
      clientEmail: "",
      serviceType: "",
      inquiryMessage: "",
    });
  };

  const updateBudgetStatus = async (budgetId: string, status: string) => {
    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update budget status");
      }

      toast({
        title: "Success",
        description:
          status === "SENT"
            ? "Budget sent successfully! Client has been notified via email."
            : `Budget ${status.toLowerCase()} successfully`,
      });

      fetchBudgets();
    } catch (error) {
      console.error("Error updating budget status:", error);
      toast({
        title: "Error",
        description: "Failed to update budget status",
        variant: "destructive",
      });
    }
  };

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Budget Management</CardTitle>
            <CardDescription>
              Create and manage personalized budgets for client inquiries
            </CardDescription>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                  Create a personalized budget for a client inquiry with
                  detailed pricing
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Budget Type Selection */}
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsStandalone(false)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        !isStandalone
                          ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Existing Inquiry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsStandalone(true)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        isStandalone
                          ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>New Client</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {isStandalone
                      ? "Create a budget for a new client. We'll create their account and send them login credentials."
                      : "Create a budget for an existing inquiry from a registered client."}
                  </p>
                </div>

                {/* Client Information (Standalone Mode) */}
                {isStandalone && (
                  <div className="border-l-4 border-vyoniq-purple pl-4 space-y-4">
                    <h3 className="font-semibold text-vyoniq-purple">
                      New Client Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">Client Name *</Label>
                        <Input
                          id="clientName"
                          value={standaloneClientForm.clientName}
                          onChange={(e) =>
                            setStandaloneClientForm({
                              ...standaloneClientForm,
                              clientName: e.target.value,
                            })
                          }
                          placeholder="e.g., John Smith"
                          required={isStandalone}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">Client Email *</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={standaloneClientForm.clientEmail}
                          onChange={(e) =>
                            setStandaloneClientForm({
                              ...standaloneClientForm,
                              clientEmail: e.target.value,
                            })
                          }
                          placeholder="e.g., john@example.com"
                          required={isStandalone}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <Select
                          value={standaloneClientForm.serviceType}
                          onValueChange={(value) =>
                            setStandaloneClientForm({
                              ...standaloneClientForm,
                              serviceType: value,
                            })
                          }
                          required={isStandalone}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Web & Mobile Development">
                              Web & Mobile Development
                            </SelectItem>
                            <SelectItem value="Hosting Services">
                              Hosting Services
                            </SelectItem>
                            <SelectItem value="AI Integrations">
                              AI Integrations
                            </SelectItem>
                            <SelectItem value="Vyoniq Apps">
                              Vyoniq Apps
                            </SelectItem>
                            <SelectItem value="Custom Software">
                              Custom Software
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiryMessage">
                          Project Description
                        </Label>
                        <Textarea
                          id="inquiryMessage"
                          value={standaloneClientForm.inquiryMessage}
                          onChange={(e) =>
                            setStandaloneClientForm({
                              ...standaloneClientForm,
                              inquiryMessage: e.target.value,
                            })
                          }
                          placeholder="Brief description of the client's project needs..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!isStandalone && (
                    <div className="space-y-2">
                      <Label htmlFor="inquiry">Select Inquiry *</Label>
                      <Select
                        value={selectedInquiry}
                        onValueChange={setSelectedInquiry}
                        required={!isStandalone}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an inquiry" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiries.map((inquiry) => (
                            <SelectItem key={inquiry.id} value={inquiry.id}>
                              {inquiry.name} - {inquiry.serviceType} (
                              {inquiry.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Budget Title *</Label>
                    <Input
                      id="title"
                      value={budgetForm.title}
                      onChange={(e) =>
                        setBudgetForm({ ...budgetForm, title: e.target.value })
                      }
                      placeholder="e.g., Custom Web Application Development"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={budgetForm.description}
                    onChange={(e) =>
                      setBudgetForm({
                        ...budgetForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the scope and details of this budget..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={budgetForm.validUntil}
                      onChange={(e) =>
                        setBudgetForm({
                          ...budgetForm,
                          validUntil: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={budgetForm.currency}
                      onValueChange={(v) =>
                        setBudgetForm({
                          ...budgetForm,
                          currency: v as "USD" | "CAD",
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="CAD">
                          CAD (Canadian Dollar)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Budget Items *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBudgetItem}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>

                  {budgetItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Item {index + 1}</span>
                        {budgetItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBudgetItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              updateBudgetItem(index, "name", e.target.value)
                            }
                            placeholder="Service name"
                            required
                          />
                        </div>

                        <div>
                          <Label>Category</Label>
                          <Select
                            value={item.category}
                            onValueChange={(value) =>
                              updateBudgetItem(index, "category", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">
                                Development
                              </SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="hosting">Hosting</SelectItem>
                              <SelectItem value="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem value="consultation">
                                Consultation
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Quantity *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateBudgetItem(
                                index,
                                "quantity",
                                parseInt(e.target.value) || 1
                              )
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label>Unit Price ($) *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateBudgetItem(
                                index,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) =>
                            updateBudgetItem(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe this item..."
                          rows={2}
                        />
                      </div>

                      <div className="text-right font-medium">
                        Total: ${(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <div className="text-right text-lg font-bold">
                    Grand Total: ${calculateTotal().toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={budgetForm.adminNotes}
                    onChange={(e) =>
                      setBudgetForm({
                        ...budgetForm,
                        adminNotes: e.target.value,
                      })
                    }
                    placeholder="Internal notes for this budget..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Budget"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Budget Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">{budget.title}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{budget.inquiry.name}</div>
                    <div className="text-sm text-gray-500">
                      {budget.inquiry.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{budget.inquiry.serviceType}</TableCell>
                <TableCell>${Number(budget.totalAmount).toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(budget.status)}</TableCell>
                <TableCell>
                  {new Date(budget.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {budget.status === "DRAFT" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBudgetStatus(budget.id, "SENT")}
                      >
                        Send
                      </Button>
                    )}
                    {budget.status === "PAID" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateBudgetStatus(budget.id, "COMPLETED")
                        }
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {budgets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No budgets created yet. Create your first budget to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
