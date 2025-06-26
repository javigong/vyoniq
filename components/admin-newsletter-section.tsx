"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createNewsletter } from "@/lib/actions";
import { toast } from "sonner";
import { Plus, Send, Edit, Calendar, Eye } from "lucide-react";

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  previewText: string | null;
  isDraft: boolean;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminNewsletterSectionProps {
  newsletters: Newsletter[];
}

const initialState = {
  error: null,
  success: null,
  newsletterId: null,
};

function CreateNewsletterButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating..." : "Create Draft"}
    </Button>
  );
}

function SendNewsletterButton({ newsletterId }: { newsletterId: string }) {
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (
      !confirm(
        "Are you sure you want to send this newsletter to all subscribers? This action cannot be undone."
      )
    ) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/emails/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newsletterId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        window.location.reload(); // Refresh to update the UI
      } else {
        toast.error(data.error || "Failed to send newsletter");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSending(false);
    }
  };

  return (
    <Button
      onClick={handleSend}
      disabled={sending}
      variant="outline"
      size="sm"
      className="text-green-600 hover:text-green-700"
    >
      {sending ? (
        "Sending..."
      ) : (
        <>
          <Send className="h-4 w-4 mr-1" />
          Send
        </>
      )}
    </Button>
  );
}

export function AdminNewsletterSection({
  newsletters,
}: AdminNewsletterSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [state, formAction] = useActionState(createNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
      setShowCreateForm(false);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Newsletter Management</CardTitle>
            <CardDescription>
              Create, edit, and send newsletters to subscribers.
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant={showCreateForm ? "outline" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showCreateForm ? "Cancel" : "New Newsletter"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">
              Create New Newsletter
            </h3>
            <form ref={formRef} action={formAction} className="space-y-4">
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Newsletter subject line"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="previewText"
                  className="block text-sm font-medium mb-1"
                >
                  Preview Text
                </label>
                <Input
                  id="previewText"
                  name="previewText"
                  placeholder="Preview text shown in email clients"
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-1"
                >
                  Content (HTML) *
                </label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Newsletter HTML content..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              <CreateNewsletterButton />
            </form>
          </div>
        )}

        {newsletters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No newsletters created yet. Create your first newsletter to get
              started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">
                        {newsletter.subject}
                      </h4>
                      <Badge
                        variant={newsletter.isDraft ? "secondary" : "default"}
                      >
                        {newsletter.isDraft ? "Draft" : "Sent"}
                      </Badge>
                    </div>
                    {newsletter.previewText && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {newsletter.previewText}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created:{" "}
                        {new Date(newsletter.createdAt).toLocaleDateString()}
                      </div>
                      {newsletter.sentAt && (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-1" />
                          Sent:{" "}
                          {new Date(newsletter.sentAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    {newsletter.isDraft && (
                      <>
                        <Button variant="outline" size="sm" disabled>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <SendNewsletterButton newsletterId={newsletter.id} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
