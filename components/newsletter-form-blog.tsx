"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/lib/actions";
import { toast } from "sonner";

const initialState = {
  error: null,
  success: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-vyoniq-green hover:bg-vyoniq-green/90 text-white font-semibold py-2 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {pending ? "Subscribing..." : "Subscribe"}
    </button>
  );
}

export function NewsletterFormBlog() {
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
    <div className="p-6 bg-vyoniq-gray dark:bg-vyoniq-slate rounded-lg">
      <h3 className="text-xl font-bold text-vyoniq-blue dark:text-white mb-4">
        Subscribe
      </h3>
      <p className="text-sm text-vyoniq-text dark:text-vyoniq-dark-text mb-4">
        Get the latest insights delivered to your inbox
      </p>
      <form ref={formRef} action={formAction} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          className="w-full px-4 py-2 rounded-md bg-white dark:bg-vyoniq-dark-bg border border-gray-200 dark:border-gray-700 text-vyoniq-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-vyoniq-green"
          required
        />
        <SubmitButton />
      </form>
    </div>
  );
}
