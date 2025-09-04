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
  RefreshCw,
  Calendar,
  Users,
  UserPlus,
} from "lucide-react";
import { z } from "zod";
import { formatCurrency } from "@/lib/utils";

interface SubscriptionItem {
  id?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category?: string;
  servicePricingId?: string;
  isCustom: boolean;
}

interface Subscription {
  id: string;
  title: string;
  description?: string;
  monthlyAmount: number;
  currency: string;
  status: string;
  billingInterval: string;
  trialPeriodDays?: number;
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
  items: SubscriptionItem[];
  subscriptions: Array<{
    id: string;
    amount: number;
    status: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    nextBillingDate?: string;
  }>;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  status: string;
}

interface ServicePricing {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  serviceType: string;
  currency: string;
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
  ACTIVE:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  PAST_DUE:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  COMPLETED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const statusIcons = {
  DRAFT: Clock,
  SENT: DollarSign,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  EXPIRED: Clock,
  ACTIVE: RefreshCw,
  CANCELLED: XCircle,
  PAST_DUE: Clock,
  COMPLETED: CheckCircle,
};

export function AdminSubscriptionSection() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
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
  const [subscriptionItems, setSubscriptionItems] = useState<
    SubscriptionItem[]
  >([
    {
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      category: "",
      isCustom: true,
    },
  ]);
  const [subscriptionForm, setSubscriptionForm] = useState({
    title: "",
    description: "",
    validUntil: "",
    adminNotes: "",
    currency: "USD" as "USD" | "CAD",
    billingInterval: "month" as "month" | "year",
    trialPeriodDays: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
    fetchInquiries();
    fetchServicePricing();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
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
        setServicePricing(data.servicePricing || []);
      }
    } catch (error) {
      console.error("Error fetching service pricing:", error);
      setServicePricing([]); // Set empty array on error to prevent undefined
    }
  };

  const addSubscriptionItem = () => {
    setSubscriptionItems([
      ...subscriptionItems,
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

  const removeSubscriptionItem = (index: number) => {
    if (subscriptionItems.length > 1) {
      setSubscriptionItems(subscriptionItems.filter((_, i) => i !== index));
    }
  };

  const updateSubscriptionItem = (index: number, field: string, value: any) => {
    const updatedItems = [...subscriptionItems];
    (updatedItems[index] as any)[field] = value;

    // Calculate total price when quantity or unit price changes
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].unitPrice =
        field === "unitPrice" ? value : updatedItems[index].unitPrice;
      // For subscriptions, we don't calculate totalPrice per item since it's recurring
    }

    setSubscriptionItems(updatedItems);
  };

  const addServicePricingItem = (servicePricingId: string) => {
    const service = servicePricing.find((s) => s.id === servicePricingId);
    if (service) {
      setSubscriptionItems([
        ...subscriptionItems,
        {
          name: service.name,
          description: service.description,
          quantity: 1,
          unitPrice: service.basePrice,
          category: service.serviceType,
          servicePricingId: service.id,
          isCustom: false,
        },
      ]);
    }
  };

  const calculateTotal = () => {
    return subscriptionItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiEndpoint = isStandalone
        ? "/api/subscriptions/standalone"
        : "/api/subscriptions";

      let requestBody;
      if (isStandalone) {
        requestBody = {
          clientName: standaloneClientForm.clientName,
          clientEmail: standaloneClientForm.clientEmail,
          serviceType: standaloneClientForm.serviceType,
          inquiryMessage: standaloneClientForm.inquiryMessage || undefined,
          title: subscriptionForm.title,
          description: subscriptionForm.description,
          validUntil: subscriptionForm.validUntil || undefined,
          adminNotes: subscriptionForm.adminNotes,
          currency: subscriptionForm.currency,
          billingInterval: subscriptionForm.billingInterval,
          trialPeriodDays: subscriptionForm.trialPeriodDays,
          items: subscriptionItems.filter(
            (item) => item.name && item.unitPrice > 0
          ),
        };
      } else {
        requestBody = {
          inquiryId: selectedInquiry,
          title: subscriptionForm.title,
          description: subscriptionForm.description,
          validUntil: subscriptionForm.validUntil || undefined,
          adminNotes: subscriptionForm.adminNotes,
          currency: subscriptionForm.currency,
          billingInterval: subscriptionForm.billingInterval,
          trialPeriodDays: subscriptionForm.trialPeriodDays,
          items: subscriptionItems.filter(
            (item) => item.name && item.unitPrice > 0
          ),
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
        throw new Error(error.error || "Failed to create subscription");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: data.message || "Subscription created successfully",
      });

      // Reset form
      resetForm();
      setIsCreateDialogOpen(false);
      fetchSubscriptions();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubscriptionForm({
      title: "",
      description: "",
      validUntil: "",
      adminNotes: "",
      currency: "USD",
      billingInterval: "month",
      trialPeriodDays: 0,
    });
    setSelectedInquiry("");
    setIsStandalone(false);
    setStandaloneClientForm({
      clientName: "",
      clientEmail: "",
      serviceType: "",
      inquiryMessage: "",
    });
    setSubscriptionItems([
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

  const handleStatusChange = async (
    subscriptionId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update subscription status");
      }

      toast({
        title: "Success",
        description:
          newStatus === "SENT"
            ? "Subscription sent successfully! Client has been notified via email."
            : `Subscription ${newStatus.toLowerCase()} successfully`,
      });

      fetchSubscriptions();
    } catch (error) {
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

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete subscription");
      }

      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });

      fetchSubscriptions();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete subscription",
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
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Subscription Management
            </CardTitle>
            <CardDescription>
              Create and manage client subscriptions for recurring services
            </CardDescription>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Subscription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Subscription</DialogTitle>
                <DialogDescription>
                  Create a recurring subscription proposal for a client inquiry
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subscription Type Selection */}
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
                      ? "Create a subscription for a new client. We'll create their account and send them login credentials."
                      : "Create a subscription for an existing inquiry from a registered client."}
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
                    <Label htmlFor="title">Subscription Title *</Label>
                    <Input
                      id="title"
                      value={subscriptionForm.title}
                      onChange={(e) =>
                        setSubscriptionForm({
                          ...subscriptionForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g., Monthly Website Maintenance"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={subscriptionForm.description}
                    onChange={(e) =>
                      setSubscriptionForm({
                        ...subscriptionForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Detailed description of the subscription services..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={subscriptionForm.currency}
                      onValueChange={(v) =>
                        setSubscriptionForm({
                          ...subscriptionForm,
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

                  <div className="space-y-2">
                    <Label htmlFor="billingInterval">Billing Interval *</Label>
                    <Select
                      value={subscriptionForm.billingInterval}
                      onValueChange={(v) =>
                        setSubscriptionForm({
                          ...subscriptionForm,
                          billingInterval: v as "month" | "year",
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trialPeriodDays">Trial Period (Days)</Label>
                    <Input
                      id="trialPeriodDays"
                      type="number"
                      min="0"
                      max="365"
                      value={subscriptionForm.trialPeriodDays}
                      onChange={(e) =>
                        setSubscriptionForm({
                          ...subscriptionForm,
                          trialPeriodDays: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={subscriptionForm.validUntil}
                      onChange={(e) =>
                        setSubscriptionForm({
                          ...subscriptionForm,
                          validUntil: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Add Service Template</Label>
                    <Select onValueChange={addServicePricingItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service template" />
                      </SelectTrigger>
                      <SelectContent>
                        {servicePricing && servicePricing.length > 0 ? (
                          servicePricing.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} -{" "}
                              {formatCurrency(
                                service.basePrice,
                                service.currency
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-services" disabled>
                            No services available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Subscription Items</Label>
                    <Button
                      type="button"
                      onClick={addSubscriptionItem}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {subscriptionItems.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                          <div className="md:col-span-2">
                            <Label htmlFor={`item-name-${index}`}>
                              Item Name *
                            </Label>
                            <Input
                              id={`item-name-${index}`}
                              value={item.name}
                              onChange={(e) =>
                                updateSubscriptionItem(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Service name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`item-quantity-${index}`}>
                              Quantity
                            </Label>
                            <Input
                              id={`item-quantity-${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateSubscriptionItem(
                                  index,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`item-price-${index}`}>
                              Unit Price *
                            </Label>
                            <Input
                              id={`item-price-${index}`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateSubscriptionItem(
                                  index,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              placeholder="0.00"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`item-category-${index}`}>
                              Category
                            </Label>
                            <Input
                              id={`item-category-${index}`}
                              value={item.category}
                              onChange={(e) =>
                                updateSubscriptionItem(
                                  index,
                                  "category",
                                  e.target.value
                                )
                              }
                              placeholder="Category"
                            />
                          </div>
                          <div>
                            {subscriptionItems.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSubscriptionItem(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {item.description !== undefined && (
                          <div className="mt-2">
                            <Label htmlFor={`item-description-${index}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`item-description-${index}`}
                              value={item.description}
                              onChange={(e) =>
                                updateSubscriptionItem(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Item description"
                              rows={2}
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-lg font-semibold">
                      Total{" "}
                      {subscriptionForm.billingInterval === "year"
                        ? "Annual"
                        : "Monthly"}{" "}
                      Amount:
                    </span>
                    <span className="text-xl font-bold text-vyoniq-blue dark:text-white">
                      {formatCurrency(
                        calculateTotal(),
                        subscriptionForm.currency
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={subscriptionForm.adminNotes}
                    onChange={(e) =>
                      setSubscriptionForm({
                        ...subscriptionForm,
                        adminNotes: e.target.value,
                      })
                    }
                    placeholder="Internal notes for this subscription..."
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
                    {isLoading ? "Creating..." : "Create Subscription"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Subscriptions Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first subscription proposal for a client inquiry.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Subscription
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trial Days</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subscription.inquiry.serviceType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {subscription.inquiry.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subscription.inquiry.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(
                          subscription.monthlyAmount,
                          subscription.currency
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        per {subscription.billingInterval}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {subscription.billingInterval === "year"
                          ? "Yearly"
                          : "Monthly"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      {subscription.trialPeriodDays ? (
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {subscription.trialPeriodDays} days
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No trial</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {subscription.status === "DRAFT" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(subscription.id, "SENT")
                            }
                          >
                            Send
                          </Button>
                        )}
                        {subscription.status === "SENT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusChange(subscription.id, "APPROVED")
                            }
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDeleteSubscription(subscription.id)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
