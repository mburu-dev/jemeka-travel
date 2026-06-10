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
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
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
      setScrolled(window.scrollY > 50);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Compass
              className={`w-8 h-8 transition-colors ${
                scrolled ? "text-[#0F4C75]" : "text-white"
              } group-hover:text-[#F4A261]`}
            />
            <div className="flex flex-col">
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${
                  scrolled ? "text-[#0F4C75]" : "text-white"
                }`}
                style={{ fontFamily: 'var(--font-heading)'  }}
              >
                Jemeka
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.2em] -mt-1 transition-colors ${
                  scrolled ? "text-[#2A9D8F]" : "text-white/80"
                }`}
              >
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
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? scrolled
                      ? "text-[#0F4C75] bg-[#0F4C75]/10"
                      : "text-white bg-white/20"
                    : scrolled
                    ? "text-gray-700 hover:text-[#0F4C75] hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
                  isActive("/admin")
                    ? scrolled
                      ? "text-[#0F4C75] bg-[#0F4C75]/10"
                      : "text-white bg-white/20"
                    : scrolled
                    ? "text-gray-700 hover:text-[#0F4C75] hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons / User */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    scrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  {user?.name || "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className={`${
                    scrolled
                      ? "border-[#0F4C75] text-[#0F4C75] hover:bg-[#0F4C75] hover:text-white"
                      : "border-white text-white hover:bg-white hover:text-[#0F4C75]"
                  }`}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  className={`${
                    scrolled
                      ? "bg-[#0F4C75] hover:bg-[#0a3a5a] text-white"
                      : "bg-white text-[#0F4C75] hover:bg-white/90"
                  }`}
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={scrolled ? "text-[#0F4C75]" : "text-white"}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Compass className="w-8 h-8 text-[#0F4C75]" />
                  <span
                    className="text-xl font-bold text-[#0F4C75]"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    Jemeka
                  </span>
                </Link>

                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-lg font-medium py-2 px-3 rounded-md transition-colors ${
                        isActive(link.href)
                          ? "text-[#0F4C75] bg-[#0F4C75]/10"
                          : "text-gray-700 hover:text-[#0F4C75] hover:bg-gray-50"
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
                      className="text-lg font-medium py-2 px-3 rounded-md text-gray-700 hover:text-[#0F4C75] hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  </SheetClose>
                )}

                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <span className="text-sm text-gray-500 px-3">
                        Signed in as {user?.name || "User"}
                      </span>
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full border-[#0F4C75] text-[#0F4C75]"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login" className="w-full">
                        <Button className="w-full bg-[#0F4C75] hover:bg-[#0a3a5a]">
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
