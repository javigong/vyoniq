"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, useActionState } from "react";
import { toast } from "sonner";

const initialState: {
  error?: string | null;
  success?: string | null;
} = {
  error: null,
  success: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold px-6 py-2 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {pending ? "Subscribing..." : "Subscribe"}
    </button>
  );
}

export function Footer() {
  const [state, formAction] = useActionState(
    subscribeToNewsletter,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <footer className="bg-vyoniq-slate dark:bg-vyoniq-dark-bg text-white py-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3
              className="text-2xl font-bold mb-4 tracking-tight"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              vyoniq
            </h3>
            <p className="text-gray-300 dark:text-vyoniq-dark-muted mb-4">
              AI-powered software solutions for the future of business.
            </p>
            <div>
              <h4 className="text-lg font-semibold mb-2">
                Subscribe to our newsletter
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest insights on AI and software development.
              </p>
              <form ref={formRef} action={formAction} className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-vyoniq-green"
                  required
                />
                <SubmitButton />
              </form>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-gray-300 dark:text-vyoniq-dark-muted hover:text-vyoniq-green transition-colors"
              >
                About
              </Link>
              <Link
                href="/services"
                className="block text-gray-300 dark:text-vyoniq-dark-muted hover:text-vyoniq-green transition-colors"
              >
                Services
              </Link>
              <Link
                href="#contact"
                className="block text-gray-300 dark:text-vyoniq-dark-muted hover:text-vyoniq-green transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="block text-gray-300 dark:text-vyoniq-dark-muted hover:text-vyoniq-green transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-gray-300 dark:text-vyoniq-dark-muted hover:text-vyoniq-green transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 dark:text-vyoniq-dark-muted text-sm mb-4 md:mb-0">
            © 2025 Vyoniq Technologies. All rights reserved.
          </p>

          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-white hover:text-vyoniq-green transition-colors"
              aria-label="LinkedIn"
            >
              <Image
                src="/linkedin-icon.png"
                alt="LinkedIn Icon"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-vyoniq-green transition-colors"
              aria-label="GitHub"
            >
              <Image
                src="/github-icon.png"
                alt="GitHub Icon"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-vyoniq-green transition-colors"
              aria-label="X (Twitter)"
            >
              <Image
                src="/twitter-icon.png"
                alt="X (Twitter) Icon"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
