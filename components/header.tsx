"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Cpu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { scrollToContact } from "@/lib/scroll-utils"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(false) // Close mobile menu if open

    if (pathname === "/") {
      // If we're on homepage, scroll to contact section
      scrollToContact()
    } else {
      // If we're on another page, navigate to homepage with contact hash
      router.push("/#contact")
    }
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Vyoniq Tables", href: "/vyoniq-tables" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "#contact", onClick: handleContactClick },
  ]

  return (
    <header className="sticky top-0 z-50 bg-vyoniq-slate dark:bg-vyoniq-dark-bg text-white shadow-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Cpu className="h-8 w-8 text-vyoniq-green" />
            <span className="text-2xl font-bold">Vyoniq</span>
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
              <SheetContent side="right" className="bg-vyoniq-slate dark:bg-vyoniq-dark-bg text-white">
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
