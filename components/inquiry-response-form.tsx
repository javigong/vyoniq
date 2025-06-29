"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface InquiryResponseFormProps {
  inquiryId: string;
}

export function InquiryResponseForm({ inquiryId }: InquiryResponseFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully");
      setMessage("");

      // Refresh the page to show the new message
      router.refresh();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        rows={4}
        disabled={isSubmitting}
        className="border-gray-300 dark:border-gray-600 focus:border-vyoniq-green dark:bg-vyoniq-slate dark:text-white"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!message.trim() || isSubmitting}
          className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
