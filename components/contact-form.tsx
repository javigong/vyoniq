"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Inquiry submitted!",
      description: "We'll get back to you within 24 hours.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 bg-white dark:bg-vyoniq-dark-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vyoniq-blue dark:text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-vyoniq-text dark:text-vyoniq-dark-text">
              Ready to transform your business with AI-powered solutions?
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white dark:bg-vyoniq-dark-card">
            <CardHeader>
              <CardTitle className="text-2xl text-vyoniq-blue dark:text-white text-center">
                Submit Your Inquiry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="dark:text-vyoniq-dark-text"
                    >
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      className="border-gray-300 dark:border-gray-600 focus:border-vyoniq-green dark:bg-vyoniq-slate dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="dark:text-vyoniq-dark-text"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="border-gray-300 dark:border-gray-600 focus:border-vyoniq-green dark:bg-vyoniq-slate dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="service"
                    className="dark:text-vyoniq-dark-text"
                  >
                    Service Type *
                  </Label>
                  <Select name="service" required>
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-vyoniq-green dark:bg-vyoniq-slate dark:text-white">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-vyoniq-dark-card dark:border-gray-600">
                      <SelectItem value="web-mobile">
                        Web & Mobile Development
                      </SelectItem>
                      <SelectItem value="hosting">Hosting Services</SelectItem>
                      <SelectItem value="ai">AI Integrations</SelectItem>
                      <SelectItem value="vyoniq-apps">
                        Vyoniq Apps Interest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="dark:text-vyoniq-dark-text"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="border-gray-300 dark:border-gray-600 focus:border-vyoniq-green dark:bg-vyoniq-slate dark:text-white"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-vyoniq-purple hover:bg-vyoniq-purple/90 text-white font-semibold py-3 transform hover:scale-105 transition-all duration-200"
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
