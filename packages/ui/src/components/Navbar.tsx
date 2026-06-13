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
import { Menu, LogOut, ChevronDown, Shield } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Tour Packages" },
  { href: "/services", label: "Services", hasDropdown: true },
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
      className={`sticky top-0 z-50 transition-all duration-300 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md ${
        scrolled ? "shadow-sm dark:shadow-black/50" : "border-b border-gray-100 dark:border-slate-800"
      }`}
    >
      <nav className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Logo & Brand Name */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-14 sm:h-14 sm:w-16 transition-transform duration-300">
                <img 
                  src="/logo-optimized.png" 
                  alt="Jemeka Tours & Travel Logo" 
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <span 
                  className="text-[#1a202c] dark:text-slate-100 font-bold text-xl sm:text-2xl leading-none tracking-tight transition-colors" 
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  JEMEKA
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-medium text-[10px] sm:text-[11px] tracking-wider uppercase mt-0.5">
                  Tours & Travel
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden lg:flex flex-shrink-0 justify-center items-center px-2">
            <div className="flex items-center gap-0 lg:gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1 px-2 py-2 rounded-lg text-[14px] font-medium transition-all whitespace-nowrap ${
                    isActive(link.href)
                      ? "text-[#2563eb] bg-[#eff6ff] dark:text-blue-400 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4 opacity-70" />}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`relative flex items-center gap-1 px-2 py-2 rounded-lg text-[14px] font-medium transition-all whitespace-nowrap ${
                    isActive("/admin")
                      ? "text-[#2563eb] bg-[#eff6ff] dark:text-blue-400 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* RIGHT: Actions (Theme, Sign In, CTA) */}
          <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
            
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Auth Buttons & CTA */}
            <div className="hidden lg:flex items-center gap-6">
              {isLoading ? (
                <div className="w-20 h-6 rounded bg-gray-100 dark:bg-slate-800 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-medium text-gray-600 dark:text-slate-300">
                    {user?.name || "Sign In"}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="text-[14px] font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                >
                  Sign In
                </Link>
              )}

              <Link href="/contact">
                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg px-6 py-2.5 h-auto font-medium text-[14px] shadow-sm transition-all border-none whitespace-nowrap">
                  Get Free Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white dark:bg-slate-950 border-l border-gray-100 dark:border-slate-800">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Logo */}
                  <Link href="/" className="flex items-center mb-2 w-40">
                    <img 
                      src="/logo-optimized.png" 
                      alt="Jemeka Tours & Travel" 
                      className="object-contain w-full h-auto"
                    />
                  </Link>

                  <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-900 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Theme</span>
                    <ThemeToggle />
                  </div>

                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={`text-[16px] font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-between ${
                            isActive(link.href)
                              ? "text-[#2563eb] bg-[#eff6ff] dark:text-blue-400 dark:bg-blue-900/20"
                              : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          {link.label}
                          {link.hasDropdown && <ChevronDown className="w-4 h-4 opacity-50" />}
                        </Link>
                      </SheetClose>
                    ))}

                    {isAdmin && (
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="text-[16px] font-medium py-3 px-4 rounded-lg text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
                        >
                          <Shield className="w-5 h-5 opacity-70" />
                          Admin Dashboard
                        </Link>
                      </SheetClose>
                    )}
                  </div>

                  <div className="border-t border-gray-100 dark:border-slate-800 pt-6 mt-2 flex flex-col gap-4">
                    {isAuthenticated ? (
                      <>
                        <span className="text-[15px] font-medium text-gray-600 dark:text-slate-300 px-4">
                          {user?.name || "Sign In"}
                        </span>
                        <Button
                          variant="outline"
                          onClick={logout}
                          className="w-full justify-start border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 h-11"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <SheetClose asChild>
                        <Link href="/login" className="w-full block px-4 py-2 text-[16px] font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white">
                          Sign In
                        </Link>
                      </SheetClose>
                    )}
                    <SheetClose asChild>
                      <Link href="/contact" className="w-full block">
                        <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg h-12 text-[16px] font-medium">
                          Get Free Quote
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
        </div>
      </nav>
    </header>
  );
}
