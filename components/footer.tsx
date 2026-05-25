import Link from 'next/link'
import { Car, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DriveEase</span>
            </Link>
            <p className="text-sidebar-foreground/70 leading-relaxed mb-6">
              Premium car rentals at affordable prices. Experience the freedom of the road with our top-quality vehicles.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/cars" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Book a Car
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  Insurance Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sidebar-foreground/70">
                  123 Rental Street, Los Angeles, CA 90001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sidebar-foreground/70">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sidebar-foreground/70">hello@driveease.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sidebar-foreground/60 text-sm">
            &copy; {new Date().getFullYear()} DriveEase. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sidebar-foreground/60 hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
