"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

interface InquiryMessage {
  id: string;
  message: string;
  isFromAdmin: boolean;
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "PAID" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  messages: InquiryMessage[];
  _count: {
    messages: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const statusIcons = {
  PENDING: Clock,
  IN_PROGRESS: MessageSquare,
  PAID: DollarSign,
  RESOLVED: CheckCircle,
  CLOSED: XCircle,
};

export function AdminInquirySection() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [responseMessage, setResponseMessage] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }

      const response = await fetch(`/api/inquiries?${params}`);
      if (!response.ok) throw new Error("Failed to fetch inquiries");

      const data = await response.json();
      setInquiries(data.inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Inquiry status updated");
      fetchInquiries();

      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        const updatedInquiry = await response.json();
        setSelectedInquiry(updatedInquiry);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const sendResponse = async () => {
    if (!selectedInquiry || !responseMessage.trim()) return;

    try {
      setIsResponding(true);
      const response = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: responseMessage }),
      });

      if (!response.ok) throw new Error("Failed to send response");

      toast.success("Response sent successfully");
      setResponseMessage("");

      // Refresh the inquiry details
      const inquiryResponse = await fetch(
        `/api/inquiries/${selectedInquiry.id}`
      );
      if (inquiryResponse.ok) {
        const updatedInquiry = await inquiryResponse.json();
        setSelectedInquiry(updatedInquiry);
      }

      fetchInquiries();
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Failed to send response");
    } finally {
      setIsResponding(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

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
            <CardTitle>Customer Inquiries</CardTitle>
            <CardDescription>
              Manage customer inquiries and support requests
            </CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Inquiries</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No inquiries found for the selected filter.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-sm text-gray-500">
                        {inquiry.email}
                      </div>
                      {inquiry.user && (
                        <div className="text-xs text-green-600">
                          Has Account
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.serviceType}</TableCell>
                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {inquiry._count.messages} messages
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          {selectedInquiry && (
                            <>
                              <DialogHeader>
                                <DialogTitle>
                                  Inquiry from {selectedInquiry.name}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <strong>Email:</strong>{" "}
                                    {selectedInquiry.email}
                                  </div>
                                  <div>
                                    <strong>Service:</strong>{" "}
                                    {selectedInquiry.serviceType}
                                  </div>
                                  <div>
                                    <strong>Status:</strong>{" "}
                                    {getStatusBadge(selectedInquiry.status)}
                                  </div>
                                  <div>
                                    <strong>Created:</strong>{" "}
                                    {new Date(
                                      selectedInquiry.createdAt
                                    ).toLocaleString()}
                                  </div>
                                </div>

                                <div>
                                  <strong>Update Status:</strong>
                                  <Select
                                    value={selectedInquiry.status}
                                    onValueChange={(value) =>
                                      updateInquiryStatus(
                                        selectedInquiry.id,
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-[200px] mt-2">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PENDING">
                                        Pending
                                      </SelectItem>
                                      <SelectItem value="IN_PROGRESS">
                                        In Progress
                                      </SelectItem>
                                      <SelectItem value="PAID">Paid</SelectItem>
                                      <SelectItem value="RESOLVED">
                                        Resolved
                                      </SelectItem>
                                      <SelectItem value="CLOSED">
                                        Closed
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <strong>Conversation:</strong>
                                  <div className="mt-2 space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                                    {selectedInquiry.messages.map((msg) => (
                                      <div
                                        key={msg.id}
                                        className={`p-3 rounded-lg ${
                                          msg.isFromAdmin
                                            ? "bg-blue-50 dark:bg-blue-900/20 ml-4"
                                            : "bg-gray-50 dark:bg-gray-800 mr-4"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-medium text-sm">
                                            {msg.isFromAdmin
                                              ? "Admin"
                                              : selectedInquiry.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(
                                              msg.createdAt
                                            ).toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="text-sm">{msg.message}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <strong>Send Response:</strong>
                                  <Textarea
                                    value={responseMessage}
                                    onChange={(e) =>
                                      setResponseMessage(e.target.value)
                                    }
                                    placeholder="Type your response here..."
                                    className="mt-2"
                                    rows={4}
                                  />
                                  <Button
                                    onClick={sendResponse}
                                    disabled={
                                      !responseMessage.trim() || isResponding
                                    }
                                    className="mt-2"
                                  >
                                    {isResponding
                                      ? "Sending..."
                                      : "Send Response"}
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
