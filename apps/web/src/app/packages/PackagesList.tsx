"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Users, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { ImageRotator } from "@/components/ImageRotator";
import { getGallery } from "@/lib/destinationGalleries";

interface PackagesListProps {
  packages: any[];
}

// Static "coming soon" Kenyan coastal + cross-border destinations to always display
const STATIC_DESTINATIONS = [
  {
    id: "static-diani",
    slug: "diani-beach",
    title: "Diani Beach Escape",
    shortDescription: "Kenya's most pristine white-sand beach on the south coast — turquoise waters, kite surfing, and coral reefs.",
    duration: 5,
    maxGroupSize: 10,
    price: "1200.00",
    rating: 4.9,
    reviewCount: 0,
    isActive: true,
    isComingSoon: false,
    isCrossBorder: false,
    category: "Kenyan Coast",
  },
  {
    id: "static-watamu",
    slug: "watamu",
    title: "Watamu Marine Paradise",
    shortDescription: "Snorkel with whale sharks, explore Watamu Marine National Park, and discover pristine coral gardens.",
    duration: 4,
    maxGroupSize: 8,
    price: "1050.00",
    rating: 4.8,
    reviewCount: 0,
    isActive: true,
    isComingSoon: false,
    isCrossBorder: false,
    category: "Kenyan Coast",
  },
  {
    id: "static-malindi",
    slug: "malindi",
    title: "Malindi Heritage & Coast",
    shortDescription: "Historic Swahili coast town with Vasco da Gama Pillar, marine park, and stunning beaches.",
    duration: 4,
    maxGroupSize: 10,
    price: "980.00",
    rating: 4.7,
    reviewCount: 0,
    isActive: true,
    isComingSoon: false,
    isCrossBorder: false,
    category: "Kenyan Coast",
  },
  {
    id: "static-lamu",
    slug: "lamu-island",
    title: "Lamu Island UNESCO Journey",
    shortDescription: "UNESCO World Heritage island with no cars, traditional dhow sailing, and timeless Swahili architecture.",
    duration: 5,
    maxGroupSize: 8,
    price: "1350.00",
    rating: 4.9,
    reviewCount: 0,
    isActive: true,
    isComingSoon: false,
    isCrossBorder: false,
    category: "Kenyan Coast",
  },
  {
    id: "static-serengeti",
    slug: "serengeti-classic-safari",
    title: "Serengeti Classic Safari",
    shortDescription: "4-day luxury safari with daily game drives in Serengeti — witness the world's greatest wildlife spectacle.",
    duration: 4,
    maxGroupSize: 6,
    price: "2850.00",
    rating: 4.9,
    reviewCount: 124,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "Tanzania",
  },
  {
    id: "static-zanzibar",
    slug: "zanzibar-beach-paradise",
    title: "Zanzibar Beach Paradise",
    shortDescription: "6-day tropical island escape with spice tours, Stone Town heritage, and world-class snorkeling.",
    duration: 6,
    maxGroupSize: 12,
    price: "1950.00",
    rating: 4.7,
    reviewCount: 78,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "Tanzania",
  },
  {
    id: "static-kruger",
    slug: "kruger-big-five-safari",
    title: "Kruger Big Five Safari",
    shortDescription: "5-day Big Five safari with luxury lodge accommodation in South Africa's premier national park.",
    duration: 5,
    maxGroupSize: 6,
    price: "3600.00",
    rating: 4.9,
    reviewCount: 112,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "South Africa",
  },
  {
    id: "static-victoria-falls",
    slug: "victoria-falls-adventure",
    title: "Victoria Falls Adventure",
    shortDescription: "4-day adventure at one of the Seven Natural Wonders — white-water rafting, bungee jumping, and falls tours.",
    duration: 4,
    maxGroupSize: 10,
    price: "1650.00",
    rating: 4.6,
    reviewCount: 54,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "Zimbabwe",
  },
  {
    id: "static-cape-town",
    slug: "cape-town-winelands",
    title: "Cape Town & Winelands",
    shortDescription: "5-day journey combining Table Mountain, Cape Peninsula, and Stellenbosch wine country.",
    duration: 5,
    maxGroupSize: 8,
    price: "2400.00",
    rating: 4.8,
    reviewCount: 67,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "South Africa",
  },
  {
    id: "static-marrakech",
    slug: "moroccan-culture-cuisine",
    title: "Moroccan Culture & Cuisine",
    shortDescription: "5-day cultural immersion in Marrakech with cooking classes, hammam spa, and Atlas Mountains.",
    duration: 5,
    maxGroupSize: 10,
    price: "1450.00",
    rating: 4.5,
    reviewCount: 43,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "Morocco",
  },
  {
    id: "static-santorini",
    slug: "santorini-island-escape",
    title: "Santorini Island Escape",
    shortDescription: "5-day Greek island paradise with legendary caldera sunsets, volcanic beaches, and wine tours.",
    duration: 5,
    maxGroupSize: 12,
    price: "2100.00",
    rating: 4.8,
    reviewCount: 89,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "Greece",
  },
  {
    id: "static-east-africa",
    slug: "east-african-safari-circuit",
    title: "East African Safari Circuit",
    shortDescription: "8-day epic cross-border safari combining the best of Serengeti and Masai Mara.",
    duration: 8,
    maxGroupSize: 6,
    price: "5200.00",
    rating: 4.9,
    reviewCount: 45,
    isActive: false,
    isComingSoon: true,
    isCrossBorder: true,
    category: "Tanzania + Kenya",
  },
];

export default function PackagesList({ packages }: PackagesListProps) {
  // Merge DB packages with static coming-soon destinations
  const dbSlugs = new Set(packages.map((p) => p.slug));
  const extraStatic = STATIC_DESTINATIONS.filter((d) => !dbSlugs.has(d.slug));
  const allPackages = [...packages, ...extraStatic];

  const CROSS_BORDER_SLUGS = [
    "serengeti-national-park",
    "serengeti-classic-safari",
    "zanzibar",
    "zanzibar-beach-paradise",
    "kruger-national-park",
    "kruger-big-five-safari",
    "victoria-falls",
    "victoria-falls-adventure",
    "cape-town",
    "cape-town-winelands",
    "marrakech",
    "moroccan-culture-cuisine",
    "santorini",
    "santorini-island-escape",
    "east-african-safari-circuit"
  ];

  const processedPackages = allPackages.map(pkg => {
    if (CROSS_BORDER_SLUGS.includes(pkg.slug)) {
      return { ...pkg, isActive: false, isComingSoon: true, isCrossBorder: true };
    }
    return pkg;
  });

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {processedPackages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          {pkg.isActive ? (
            <ActivePackageCard pkg={pkg} />
          ) : (
            <ComingSoonPackageCard pkg={pkg} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

function ActivePackageCard({ pkg }: { pkg: any }) {
  const gallery = getGallery(pkg.slug, pkg.image);

  return (
    <Link href={`/packages/${pkg.slug}`}>
      <Card className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl relative">
        <div className="relative h-64 overflow-hidden">
          <ImageRotator images={gallery} alt={pkg.title} />
          {/* Price badge */}
          <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 items-end">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-[#0F4C75] font-bold text-sm">
                from ${Number(pkg.price).toLocaleString()}
              </span>
            </div>
          </div>
          {/* Rating */}
          <div className="absolute bottom-10 left-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full z-30">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{pkg.rating}</span>
            <span className="text-white/60 text-xs">({pkg.reviewCount})</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pkg.duration} Days
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Max {pkg.maxGroupSize}
            </span>
          </div>
          <h3
            className="text-lg font-bold text-[#264653] mb-2 group-hover:text-[#0F4C75] transition-colors line-clamp-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {pkg.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
            {pkg.shortDescription}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-[#F4A261] font-bold text-lg">
              ${Number(pkg.price).toLocaleString()}
              <span className="text-gray-400 font-normal text-xs ml-1">/ person</span>
            </span>
            <span className="text-[#0F4C75] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ComingSoonPackageCard({ pkg }: { pkg: any }) {
  const gallery = getGallery(pkg.slug, pkg.image);
  const isCrossBorder = pkg.isCrossBorder ?? false;
  const category = pkg.category ?? "";

  return (
    <div className="cursor-default">
      <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-500 rounded-2xl relative">
        {/* Subtle overlay for inactive state */}
        <div className="absolute inset-0 bg-black/5 z-20 pointer-events-none rounded-2xl" />

        <div className="relative h-64 overflow-hidden">
          {/* Images still rotate — same quality, just locked */}
          <ImageRotator images={gallery} alt={pkg.title} subtleMotion={true} />

          {/* Coming Soon badge — PROMINENT */}
          <div className="absolute inset-0 z-30 flex items-start justify-end p-4 pointer-events-none">
            <div className="flex flex-col items-end gap-2">
              {/* No pricing info for Coming Soon destinations */}
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-bold uppercase tracking-wider">Coming Soon</span>
              </div>
              {isCrossBorder && category && (
                <div className="bg-[#0F4C75]/90 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {category}
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {pkg.reviewCount > 0 && (
            <div className="absolute bottom-10 left-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full z-30">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-semibold">{pkg.rating}</span>
              <span className="text-white/60 text-xs">({pkg.reviewCount})</span>
            </div>
          )}
        </div>

        <CardContent className="p-6 relative z-30">
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pkg.duration} Days
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Max {pkg.maxGroupSize}
            </span>
          </div>
          <h3
            className="text-lg font-bold text-[#264653] mb-2 line-clamp-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {pkg.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
            {pkg.shortDescription}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex-1"></div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              Coming Soon
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
