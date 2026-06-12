"use client";

import Link from 'next/link';
import {
  MapPin,
  Clock,
  Users,
  Star,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import Image from "next/image";

interface DestinationDetailClientProps {
  destination: any;
}

export default function DestinationDetailClient({ destination }: DestinationDetailClientProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src={destination.image || "/images/destinations/serengeti.jpg"}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/destinations"
              className="inline-flex items-center text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Destinations
            </Link>
            <div className="flex items-center gap-2 text-[#F4A261] text-sm mb-2">
              <MapPin className="w-4 h-4" />
              {destination.country}
              <Badge className="bg-white/20 text-white ml-2">
                {destination.region}
              </Badge>
              {!destination.isActive && (
                <Badge className="bg-amber-500 text-white ml-2">
                  Coming Soon
                </Badge>
              )}
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              {destination.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2
                  className="text-2xl font-bold text-[#264653] mb-4"
                  style={{ fontFamily: 'var(--font-heading)'  }}
                >
                  About {destination.name}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {destination.description}
                </p>
              </motion.div>

              {/* Highlights */}
              {destination.highlights && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-4"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(destination.highlights as string[]).map(
                      (highlight, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                        >
                          <Sparkles className="w-5 h-5 text-[#F4A261] shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* Activities */}
              {destination.activities && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-4"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    Popular Activities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(destination.activities as string[]).map((activity, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-[#0F4C75]/10 text-[#0F4C75] px-4 py-2 text-sm"
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Available Packages */}
              {destination.packages && destination.packages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-4"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    Available Tour Packages
                  </h2>
                  <div className="space-y-4">
                    {destination.packages.map((pkg: any) => {
                      const PackageCard = (
                        <Card className={`group hover:shadow-lg transition-all border-0 shadow ${!pkg.isActive ? 'grayscale opacity-80' : 'cursor-pointer'}`}>
                          <CardContent className="p-4 flex items-center gap-4 relative">
                            {!pkg.isActive && (
                              <div className="absolute top-2 right-2 z-10">
                                <Badge className="bg-amber-500 text-white text-[10px] uppercase tracking-wider">
                                  Coming Soon
                                </Badge>
                              </div>
                            )}
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={pkg.image || "/images/packages/serengeti-classic.jpg"}
                                alt={pkg.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-[#264653] group-hover:text-[#0F4C75] transition-colors truncate">
                                {pkg.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {pkg.duration} Days
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  Max {pkg.maxGroupSize}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[#0F4C75] font-bold">
                                  ${Number(pkg.price).toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm">{pkg.rating}</span>
                                </div>
                              </div>
                            </div>
                            {pkg.isActive ? (
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0F4C75] group-hover:translate-x-1 transition-all shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                            )}
                          </CardContent>
                        </Card>
                      );
                      
                      return pkg.isActive ? (
                        <Link key={pkg.id} href={`/packages/${pkg.slug}`}>
                          {PackageCard}
                        </Link>
                      ) : (
                        <div key={pkg.id} className="cursor-not-allowed">
                          {PackageCard}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h3
                    className="text-lg font-bold text-[#264653]"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    Quick Info
                  </h3>

                  {destination.bestTimeToVisit && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#2A9D8F] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Best Time to Visit
                        </div>
                        <div className="text-sm text-gray-500">
                          {destination.bestTimeToVisit}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Link href="/contact">
                      <Button className="w-full bg-[#0F4C75] hover:bg-[#1B262C]">
                        Inquire About This Destination
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
