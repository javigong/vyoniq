import Link from "next/link"
import { Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-vyoniq-slate text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Vyoniq</h3>
            <p className="text-gray-300 mb-4">AI-powered software solutions for the future of business.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-vyoniq-green transition-colors">
                About
              </Link>
              <Link href="/services" className="block text-gray-300 hover:text-vyoniq-green transition-colors">
                Services
              </Link>
              <Link href="#contact" className="block text-gray-300 hover:text-vyoniq-green transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-gray-300 hover:text-vyoniq-green transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-vyoniq-green transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">© 2025 Vyoniq. All rights reserved.</p>

          <div className="flex space-x-4">
            <Link href="#" className="text-white hover:text-vyoniq-green transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-white hover:text-vyoniq-green transition-colors" aria-label="GitHub">
              <Github className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
