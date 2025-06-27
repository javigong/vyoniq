"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Mail } from "lucide-react";
import Link from "next/link";

interface UnsubscribeState {
  loading: boolean;
  success: boolean;
  error: string | null;
  email: string | null;
  alreadyUnsubscribed: boolean;
}

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<UnsubscribeState>({
    loading: true,
    success: false,
    error: null,
    email: null,
    alreadyUnsubscribed: false,
  });

  const handleUnsubscribe = async () => {
    if (!token) return;

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch("/api/emails/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          loading: false,
          success: true,
          error: null,
          email: data.email,
          alreadyUnsubscribed: false,
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: data.error || "Failed to unsubscribe",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "An unexpected error occurred",
      }));
    }
  };

  useEffect(() => {
    if (!token) {
      setState({
        loading: false,
        success: false,
        error: "Invalid unsubscribe link",
        email: null,
        alreadyUnsubscribed: false,
      });
      return;
    }

    // Validate token first
    const validateToken = async () => {
      try {
        const response = await fetch(
          `/api/emails/newsletter/unsubscribe?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          setState({
            loading: false,
            success: false,
            error: null,
            email: data.email,
            alreadyUnsubscribed: !data.isSubscribed,
          });
        } else {
          setState({
            loading: false,
            success: false,
            error: data.error || "Invalid unsubscribe link",
            email: null,
            alreadyUnsubscribed: false,
          });
        }
      } catch (error) {
        setState({
          loading: false,
          success: false,
          error: "An unexpected error occurred",
          email: null,
          alreadyUnsubscribed: false,
        });
      }
    };

    validateToken();
  }, [token]);

  return (
    <main className="min-h-screen bg-white dark:bg-vyoniq-dark-bg">
      <Header />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-vyoniq-blue dark:text-white">
                  Newsletter Unsubscribe
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {state.loading && (
                  <div className="py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-vyoniq-green border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                      Processing your request...
                    </p>
                  </div>
                )}

                {!state.loading && state.error && (
                  <div className="py-8">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-600 mb-2">
                      Error
                    </h3>
                    <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-6">
                      {state.error}
                    </p>
                    <Button asChild>
                      <Link href="/">Return to Homepage</Link>
                    </Button>
                  </div>
                )}

                {!state.loading && state.success && (
                  <div className="py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-600 mb-2">
                      Successfully Unsubscribed
                    </h3>
                    <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-2">
                      {state.email} has been removed from our newsletter.
                    </p>
                    <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text mb-6">
                      You will no longer receive newsletter emails from Vyoniq.
                      We're sorry to see you go!
                    </p>
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <Link href="/">Return to Homepage</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/blog">Visit Our Blog</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {!state.loading &&
                  !state.error &&
                  !state.success &&
                  state.alreadyUnsubscribed && (
                    <div className="py-8">
                      <Mail className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-yellow-600 mb-2">
                        Already Unsubscribed
                      </h3>
                      <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-6">
                        {state.email} is already unsubscribed from our
                        newsletter.
                      </p>
                      <Button asChild>
                        <Link href="/">Return to Homepage</Link>
                      </Button>
                    </div>
                  )}

                {!state.loading &&
                  !state.error &&
                  !state.success &&
                  !state.alreadyUnsubscribed &&
                  state.email && (
                    <div className="py-8">
                      <Mail className="w-16 h-16 text-vyoniq-blue mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-vyoniq-blue dark:text-white mb-2">
                        Confirm Unsubscribe
                      </h3>
                      <p className="text-vyoniq-text dark:text-vyoniq-dark-text mb-2">
                        Are you sure you want to unsubscribe {state.email} from
                        the Vyoniq newsletter?
                      </p>
                      <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text mb-6">
                        You'll no longer receive updates about AI insights,
                        software development tips, and Vyoniq Apps
                        announcements.
                      </p>
                      <div className="space-y-2">
                        <Button
                          onClick={handleUnsubscribe}
                          variant="destructive"
                          className="w-full"
                        >
                          Yes, Unsubscribe Me
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/">No, Keep Me Subscribed</Link>
                        </Button>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white dark:bg-vyoniq-dark-bg">
          <Header />
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardContent className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-vyoniq-green border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-vyoniq-text dark:text-vyoniq-dark-text">
                      Loading...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
