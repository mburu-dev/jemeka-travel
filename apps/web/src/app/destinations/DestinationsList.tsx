"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@jemeka/ui/components/ui/badge";

interface DestinationsListProps {
  destinations: any[];
}

export default function DestinationsList({ destinations }: DestinationsListProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {destinations.map((dest, index) => (
        <motion.div
          key={dest.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative h-96 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
        >
          <Image
            src={dest.image || "/images/destinations/serengeti.jpg"}
            alt={dest.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Region Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 uppercase tracking-wider text-[10px]">
              {dest.region}
            </Badge>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 text-[#F4A261] text-sm mb-2">
              <MapPin className="w-4 h-4" />
              {dest.country}
            </div>
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {dest.name}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-4 leading-relaxed">
              {dest.shortDescription || dest.description}
            </p>
            <Link href={`/destinations/${dest.slug}`}>
              <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                Explore Destination
                <ChevronRight className="w-4 h-4 text-[#F4A261]" />
              </span>
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
