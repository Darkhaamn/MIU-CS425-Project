'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Car, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DriveEase</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/cars" className="text-muted-foreground hover:text-foreground transition-colors">
              Browse Cars
            </Link>
            <Link href="/booking" className="text-muted-foreground hover:text-foreground transition-colors">
              Book Now
            </Link>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/cars"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Browse Cars
            </Link>
            <Link
              href="/booking"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
            <Link
              href="/admin"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <div className="pt-3 flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-center">
                Sign In
              </Button>
              <Button className="w-full justify-center">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
