"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Star, Clock, Users, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";

interface PackagesListProps {
  packages: any[];
}

export default function PackagesList({ packages }: PackagesListProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/packages/${pkg.slug}`}>
            <Card className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 rounded-2xl">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image || "/images/packages/serengeti-classic.jpg"}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <span className="text-[#0F4C75] font-bold text-sm">
                    from ${Number(pkg.price).toLocaleString()}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-semibold">
                    {pkg.rating}
                  </span>
                  <span className="text-white/60 text-xs">
                    ({pkg.reviewCount})
                  </span>
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
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {pkg.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {pkg.shortDescription}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-[#F4A261] font-bold text-lg">
                    ${Number(pkg.price).toLocaleString()}
                    <span className="text-gray-400 font-normal text-xs ml-1">
                      / person
                    </span>
                  </span>
                  <span className="text-[#0F4C75] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
