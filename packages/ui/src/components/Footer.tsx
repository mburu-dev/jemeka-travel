import Link from "next/link";
import { Compass, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#264653] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-[#F4A261]" />
              <div className="flex flex-col">
                <span
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-heading)'  }}
                >
                  Jemeka
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#2A9D8F]">
                  Tours & Travel
                </span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Crafting unforgettable journeys across Africa and beyond. 
              Your adventure begins with us.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#F4A261] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F4A261] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F4A261] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F4A261] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F4A261]">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Destinations", href: "/destinations" },
                { label: "Tour Packages", href: "/packages" },
                { label: "About Us", href: "/about" },
                { label: "Testimonials", href: "/testimonials" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F4A261]">Popular Destinations</h3>
            <ul className="space-y-3">
              {[
                { label: "Serengeti, Tanzania", href: "/destinations/serengeti-national-park" },
                { label: "Masai Mara, Kenya", href: "/destinations/masai-mara" },
                { label: "Zanzibar, Tanzania", href: "/destinations/zanzibar" },
                { label: "Cape Town, SA", href: "/destinations/cape-town" },
                { label: "Victoria Falls", href: "/destinations/victoria-falls" },
                { label: "Santorini, Greece", href: "/destinations/santorini" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#F4A261]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2A9D8F] mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Safari Road, Arusha,<br />
                  Tanzania, East Africa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#2A9D8F] shrink-0" />
                <span className="text-gray-300 text-sm">+254 726 912577</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#2A9D8F] shrink-0" />
                <span className="text-gray-300 text-sm">njoros2025@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Jemeka Tours & Travel. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
