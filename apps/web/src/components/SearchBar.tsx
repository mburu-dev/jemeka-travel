"use client";

import { useState, useEffect, useRef } from "react";
import { trpc } from "@/providers/trpc";
import { Search, Loader2, MapPin, Package, X } from "lucide-react";
import { Input } from "@jemeka/ui/components/ui/input";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SearchBar() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading } = trpc.search.global.useQuery(
    { q: debouncedQ },
    { enabled: debouncedQ.length >= 2 }
  );

  return (
    <div className="relative w-full max-w-sm ml-4 hidden md:block" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search destinations, tours..."
          className="pl-9 pr-9 h-9 w-full bg-gray-50 border-gray-200 focus-visible:ring-[#F4A261] rounded-full transition-all text-sm"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {q && (
          <button 
            onClick={() => { setQ(""); setDebouncedQ(""); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && q.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-8 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : data && (data.packages.length > 0 || data.destinations.length > 0) ? (
              <div className="py-2">
                {/* Destinations */}
                {data.destinations.length > 0 && (
                  <div className="px-3 pb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-2">
                      Destinations
                    </h3>
                    <div className="space-y-1">
                      {data.destinations.map((dest: { id: number; slug: string; image?: string; name: string; country: string }) => (
                        <Link 
                          key={dest.id} 
                          href={`/destinations/${dest.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 shrink-0 relative">
                            {dest.image ? (
                              <Image src={dest.image} alt={dest.name} fill className="object-cover" />
                            ) : (
                              <MapPin className="w-4 h-4 text-gray-400 m-auto mt-2" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{dest.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{dest.country}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Separator if both exist */}
                {data.destinations.length > 0 && data.packages.length > 0 && (
                  <div className="h-px bg-gray-100 my-2" />
                )}

                {/* Packages */}
                {data.packages.length > 0 && (
                  <div className="px-3 pt-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-2">
                      Tour Packages
                    </h3>
                    <div className="space-y-1">
                      {data.packages.map((pkg: { id: number; slug: string; image?: string; title: string; category: string; price: string }) => (
                        <Link 
                          key={pkg.id} 
                          href={`/packages/${pkg.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 shrink-0 relative">
                            {pkg.image ? (
                              <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-gray-400 m-auto mt-2" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{pkg.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="capitalize">{pkg.category}</span>
                              <span>•</span>
                              <span className="font-medium text-[#F4A261]">${pkg.price}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No results found for "{q}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
