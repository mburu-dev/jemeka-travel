"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@jemeka/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@jemeka/ui/components/ui/sheet";
import {
  Menu,
  Compass,
  LogOut,
  User,
  Shield,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Tour Packages" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ searchBar }: { searchBar?: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Mock auth state for marketing site
  const isAuthenticated = false;
  const isAdmin = false;
  const isLoading = false;
  const user = null;
  const logout = () => {};

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname?.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-14 w-16 sm:w-20 transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/logo-optimized.png" 
                alt="Jemeka Tours & Travel Logo" 
                className="object-contain w-full h-full"
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <span 
                className="text-[#264653] font-bold text-xl sm:text-2xl leading-none tracking-tight" 
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                JEMEKA
              </span>
              <span className="text-[#F4A261] font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-0.5">
                Tours & Travel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors group ${
                  isActive(link.href)
                    ? "text-[#0F4C75] bg-[#0F4C75]/5"
                    : "text-gray-600 hover:text-[#0F4C75] hover:bg-gray-50"
                }`}
              >
                {link.label}
                {/* Modern subtle bottom border indicator on hover/active */}
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-t-full transition-all duration-300 bg-[#F4A261] ${
                    isActive(link.href) ? "w-1/2" : "w-0 group-hover:w-1/2"
                  }`} 
                />
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 group ${
                  isActive("/admin")
                    ? "text-[#0F4C75] bg-[#0F4C75]/5"
                    : "text-gray-600 hover:text-[#0F4C75] hover:bg-gray-50"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
                <span 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-t-full transition-all duration-300 bg-[#F4A261] ${
                    isActive("/admin") ? "w-1/2" : "w-0 group-hover:w-1/2"
                  }`} 
                />
              </Link>
            )}
          </div>

          <div className="flex-1 flex justify-end lg:justify-center px-4 max-w-sm ml-auto lg:ml-0">
             {searchBar}
          </div>

          {/* Auth Buttons / User */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-[#F4A261] hover:bg-[#e08c4f] text-white rounded-full px-6 shadow-sm shadow-orange-200 transition-all hover:-translate-y-0.5">
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden ml-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="flex items-center mb-4 w-40">
                  <img 
                    src="/logo-optimized.png" 
                    alt="Jemeka Tours & Travel" 
                    className="object-contain w-full h-auto"
                  />
                </Link>

                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-lg font-medium py-2 px-3 rounded-md transition-colors ${
                        isActive(link.href)
                          ? "text-[#0F4C75] bg-[#0F4C75]/5 border-l-4 border-[#F4A261]"
                          : "text-gray-600 hover:text-[#0F4C75] hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                {isAdmin && (
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="text-lg font-medium py-2 px-3 rounded-md text-gray-600 hover:text-[#0F4C75] hover:bg-gray-50 flex items-center gap-2 border-l-4 border-transparent"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  </SheetClose>
                )}

                <div className="border-t border-gray-100 pt-4 mt-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <span className="text-sm text-gray-500 px-3">
                        Signed in as {user?.name || "User"}
                      </span>
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login" className="w-full">
                        <Button className="w-full bg-[#F4A261] hover:bg-[#e08c4f] text-white rounded-full">
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
