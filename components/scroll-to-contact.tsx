"use client";

import { useEffect } from "react";
import { scrollToContact } from "@/lib/scroll-utils";

export function ScrollToContact() {
  useEffect(() => {
    // Check if URL has #contact hash and scroll to it
    if (window.location.hash === "#contact") {
      // Small delay to ensure the page is fully loaded
      setTimeout(() => {
        scrollToContact();
      }, 100);
    }
  }, []);

  return null; // This component doesn't render anything
}
