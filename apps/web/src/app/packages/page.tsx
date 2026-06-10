"use client";

import { useState } from "react";
import Link from 'next/link';

import { trpc } from "@/providers/trpc";
import { Layout } from "@jemeka/ui/components/Layout";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { Input } from "@jemeka/ui/components/ui/input";
import { Slider } from "@jemeka/ui/components/ui/slider";
import {
  Star,
  Clock,
  Users,
  Search,
  Filter,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Packages() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: packages, isLoading } = trpc.package.list.useQuery({
    category: selectedCategory || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
  });

  const { data: categories } = trpc.package.categories.useQuery();

  const filteredPackages = packages?.filter((pkg) => {
    if (search) {
      const s = search.toLowerCase();
      return (
        pkg.title.toLowerCase().includes(s) ||
        pkg.shortDescription?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#0F4C75]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/hero-home.jpg"
            alt="Tour Packages"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)'  }}
          >
            Tour Packages
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Handcrafted itineraries for unforgettable adventures across Africa
            and beyond.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              {(selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Badge className="ml-2 bg-[#F4A261] text-white">!</Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4"
            >
              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!selectedCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("")}
                    className={!selectedCategory ? "bg-[#0F4C75]" : ""}
                  >
                    All
                  </Button>
                  {categories?.map((cat) => (
                    <Button
                      key={cat.value}
                      variant={selectedCategory === cat.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={selectedCategory === cat.value ? "bg-[#0F4C75]" : ""}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  step={100}
                  className="max-w-md"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("");
                  setPriceRange([0, 10000]);
                  setSearch("");
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-56 bg-gray-200 rounded-t-lg" />
                  <div className="h-32 bg-gray-100 rounded-b-lg" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-gray-500">
                Showing {filteredPackages?.length || 0} packages
              </div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredPackages?.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/packages/${pkg.slug}`}>
                      <Card className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={pkg.image || "/images/packages/serengeti-classic.jpg"}
                            alt={pkg.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <span className="text-[#0F4C75] font-bold">
                              ${Number(pkg.price).toLocaleString()}
                            </span>
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-[#F4A261] hover:bg-[#e08c4f] text-white capitalize">
                              {pkg.category}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {pkg.duration} Days
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Max {pkg.maxGroupSize}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {pkg.difficulty}
                            </span>
                          </div>
                          <h3
                            className="text-lg font-bold text-[#264653] mb-2 group-hover:text-[#0F4C75] transition-colors"
                            style={{ fontFamily: 'var(--font-heading)'  }}
                          >
                            {pkg.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                            {pkg.shortDescription}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium">
                                {pkg.rating}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({pkg.reviewCount})
                              </span>
                            </div>
                            <span className="text-[#0F4C75] text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                              View Details
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {filteredPackages?.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    No packages found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory("");
                      setPriceRange([0, 10000]);
                      setSearch("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
