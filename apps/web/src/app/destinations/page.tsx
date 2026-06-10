"use client";

import { useState } from "react";
import Link from 'next/link';

import { trpc } from "@/providers/trpc";
import { Layout } from "@jemeka/ui/components/Layout";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Button } from "@jemeka/ui/components/ui/button";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { MapPin, ChevronRight, Globe } from "lucide-react";
import { motion } from "framer-motion";

const regions = [
  { value: "", label: "All Regions" },
  { value: "africa", label: "Africa" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "americas", label: "Americas" },
  { value: "oceania", label: "Oceania" },
];

export default function Destinations() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const { data: destinations, isLoading } = trpc.destination.list.useQuery(
    selectedRegion ? { region: selectedRegion } : undefined
  );

  return (
    <Layout>
      {/* Page Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#264653]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/about-hero.jpg"
            alt="Destinations"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)'  }}
          >
            Our Destinations
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Explore breathtaking destinations across Africa and beyond, each
            offering unique experiences and unforgettable memories.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Globe className="w-5 h-5 text-[#0F4C75] shrink-0" />
            {regions.map((region) => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region.value)}
                className={`rounded-full whitespace-nowrap ${
                  selectedRegion === region.value
                    ? "bg-[#0F4C75] text-white"
                    : "text-gray-600 hover:text-[#0F4C75]"
                }`}
              >
                {region.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {destinations?.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/destinations/${dest.slug}`}>
                    <Card className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={dest.image || "/images/destinations/serengeti.jpg"}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#F4A261] hover:bg-[#e08c4f] text-white">
                            {dest.region}
                          </Badge>
                        </div>
                        {dest.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-[#0F4C75] hover:bg-[#0a3a5a] text-white">
                              Featured
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-1 text-[#F4A261] text-sm mb-1">
                            <MapPin className="w-4 h-4" />
                            {dest.country}
                          </div>
                          <h3
                            className="text-xl font-bold text-white"
                            style={{ fontFamily: 'var(--font-heading)'  }}
                          >
                            {dest.name}
                          </h3>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {dest.shortDescription}
                        </p>
                        {dest.bestTimeToVisit && (
                          <div className="text-sm text-gray-500 mb-3">
                            <span className="font-medium">Best time:</span>{" "}
                            {dest.bestTimeToVisit}
                          </div>
                        )}
                        <div className="flex items-center text-[#0F4C75] text-sm font-medium">
                          Explore Destination
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
