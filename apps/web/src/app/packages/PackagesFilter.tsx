"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from "@jemeka/ui/components/ui/button";
import { Input } from "@jemeka/ui/components/ui/input";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { Slider } from "@jemeka/ui/components/ui/slider";
import { Search, Filter, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface PackagesFilterProps {
  categories: { value: string; label: string }[];
}

export default function PackagesFilter({ categories }: PackagesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('q') || "");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const selectedCategory = searchParams.get('category') || "";
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 10000;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    router.push(`/packages?${params.toString()}`);
  }, [debouncedSearch]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/packages?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push('/packages');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {(selectedCategory || minPrice > 0 || maxPrice < 10000) && (
            <Badge className="ml-2 bg-[#F4A261] text-white">!</Badge>
          )}
        </Button>
        {(search || selectedCategory || minPrice > 0 || maxPrice < 10000) && (
          <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <h4 className="font-semibold text-[#264653] text-sm">Category</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => updateParams({ category: "" })}
                className="rounded-full"
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  size="sm"
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => updateParams({ category: cat.value })}
                  className="rounded-full capitalize"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-[#264653] text-sm">Price Range</h4>
              <span className="text-sm text-gray-500">
                ${minPrice} - ${maxPrice}
              </span>
            </div>
            <Slider
              defaultValue={[minPrice, maxPrice]}
              max={10000}
              step={100}
              onValueCommit={(val) => 
                updateParams({ 
                  minPrice: val[0].toString(), 
                  maxPrice: val[1].toString() 
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
