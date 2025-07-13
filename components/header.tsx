"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { scrollToContact } from "@/lib/scroll-utils";
import { useUser, SignInButton } from "@clerk/nextjs";

function AuthButtons() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Don't render anything until Clerk is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>;
  }

  return (
    <>
      {isSignedIn ? (
        <Button asChild variant="secondary" size="sm">
          <Link href="/dashboard">
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button variant="secondary" size="sm">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </SignInButton>
      )}
    </>
  );
}

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { isSignedIn, user, isLoaded } = useUser();

  // Don't render anything until Clerk is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
    );
  }

  return (
    <div className="pt-4 border-t border-gray-600">
      {isSignedIn ? (
        <Button asChild variant="secondary" className="w-full">
          <Link href="/dashboard" onClick={onClose}>
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false); // Close mobile menu if open

    if (pathname === "/") {
      // If we're on homepage, scroll to contact section
      scrollToContact();
    } else {
      // If we're on another page, navigate to homepage with contact hash
      router.push("/#contact");
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Custom Apps", href: "/vyoniq-apps" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "#contact", onClick: handleContactClick },
  ];

  return (
    <header className="sticky top-0 z-50 bg-vyoniq-slate dark:bg-vyoniq-dark-bg text-white shadow-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              vyoniq
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="text-white hover:text-vyoniq-green transition-colors duration-200 hover:underline"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white hover:text-vyoniq-green transition-colors duration-200 hover:underline"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Authentication Buttons */}
            <AuthButtons />
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-vyoniq-slate dark:bg-vyoniq-dark-bg text-white"
              >
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          className="text-white hover:text-vyoniq-green transition-colors duration-200 text-lg text-left"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-white hover:text-vyoniq-green transition-colors duration-200 text-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Mobile Authentication Buttons */}
                  <MobileAuthButtons onClose={() => setIsOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
