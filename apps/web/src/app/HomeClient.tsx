"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ImageRotator } from '@/components/ImageRotator';
import { getGallery } from '@/lib/destinationGalleries';
import { HeroSlideshow } from '@jemeka/ui/components/HeroSlideshow';
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import {
  Star,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Compass,
  Shield,
  Heart,
  Quote,
  ChevronRight,
  Check,
  Globe,
  Award,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } } as any,
};

interface HomeClientProps {
  destinations: any[];
  packages: any[];
}

export default function HomeClient({ destinations, packages }: HomeClientProps) {
  const prefersReducedMotion = useReducedMotion();

  // When reduced motion is preferred, disable all enter animations
  const motionProps = prefersReducedMotion
    ? { initial: false, animate: false, transition: { duration: 0 } }
    : {};

  const staticTestimonials = [
    { id: 1, name: "Sarah Mitchell", destination: "Serengeti Safari", comment: "Absolutely life-changing. Jemeka's guides knew exactly where to find the lions at sunset — a moment I'll never forget.", rating: 5, isVerified: true },
    { id: 2, name: "James Okonkwo", destination: "Kilimanjaro Trek", comment: "Reaching the summit of Kilimanjaro was my dream, and Jemeka made it a reality. The support team was phenomenal throughout.", rating: 5, isVerified: true },
    { id: 3, name: "Priya Sharma", destination: "Zanzibar Retreat", comment: "From the dhow sunset cruise to the spice farm tour — every detail was perfect. Truly five-star service.", rating: 5, isVerified: true },
    { id: 4, name: "Hans Weber", destination: "Maasai Mara Wildlife", comment: "We saw the Big Five in just two days! The camp was luxurious yet beautifully close to nature. Highly recommend Jemeka.", rating: 5, isVerified: true },
  ];

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Slideshow Background */}
        <HeroSlideshow totalSlides={38} />

        {/* Multi-layer gradient overlay for depth — sits above slideshow, below content */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/25 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" } as any}
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#F4A261] animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">East Africa's Most Trusted Tour Operator</span>
            </motion.div>

            <h1
              className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-6 leading-none"
              style={{ fontFamily: 'var(--font-heading)', textShadow: "0 4px 40px rgba(0,0,0,0.4)"  }}
            >
              Unforgettable
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #F4A261, #E76F51, #FBBF24)" }}
              >
                Journeys Await
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Experience the raw magic of Africa with expertly crafted safaris,
              cultural immersions and beach escapes — all tailored to you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/packages">
                <Button
                  size="lg"
                  className="group bg-[#F4A261] hover:bg-[#e08c4f] text-white px-10 py-7 text-lg font-semibold rounded-full shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                >
                  Explore Packages
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/destinations">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-[#264653] backdrop-blur-sm px-10 py-7 text-lg font-semibold rounded-full transition-all duration-300"
                >
                  View Destinations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="relative bg-gradient-to-r from-[#0F4C75] via-[#1a6a9e] to-[#0F4C75] py-12 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px"}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, value: "10+", label: "Years of Excellence" },
              { icon: Users, value: "5,000+", label: "Happy Travelers" },
              { icon: Globe, value: "50+", label: "Destinations" },
              { icon: Shield, value: "100%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-[#F4A261] mx-auto mb-3" />
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DESTINATIONS ===== */}
      <section className="py-24 bg-stone-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#2A9D8F] text-xs uppercase tracking-[0.3em] font-semibold">Explore the World</span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#264653] mt-3 mb-4"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              Featured Destinations
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              From the vast savannas of Tanzania to the turquoise shores of the Indian Ocean — discover our most loved destinations.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {destinations.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">No featured destinations found.</div>
            ) : destinations.map((dest, i) => (
              <motion.div key={dest.id} variants={itemVariants} className={i === 0 ? "md:col-span-2" : ""}>
                <Link href={`/destinations/${dest.slug}`}>
                  <div className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 ${i === 0 ? "h-80" : "h-80"}`}>
                    <Image
                      src={dest.image || "/serengeti.jpg"}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Country badge */}
                    <div className="absolute top-5 left-5">
                      <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                        <MapPin className="w-3 h-3" />
                        {dest.country}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)'  }}>
                        {dest.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-1">{dest.shortDescription}</p>
                      <span className="inline-flex items-center gap-1 text-[#F4A261] text-sm font-medium group-hover:gap-2 transition-all">
                        Explore
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/destinations">
              <Button variant="outline" size="lg" className="border-[#264653] text-[#264653] hover:bg-[#264653] hover:text-white rounded-full px-10 transition-all duration-300">
                View All Destinations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PACKAGES ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#2A9D8F] text-xs uppercase tracking-[0.3em] font-semibold">Curated Experiences</span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#264653] mt-3 mb-4"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              Popular Tour Packages
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Handcrafted itineraries designed for the curious, the adventurous, and the luxury traveler.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {packages.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">No featured packages found.</div>
            ) : packages.map((pkg) => {
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
              const isComingSoon = CROSS_BORDER_SLUGS.includes(pkg.slug);

              if (isComingSoon) {
                return (
                  <motion.div key={pkg.id} variants={itemVariants}>
                    <div className="cursor-default">
                      <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-500 rounded-2xl relative">
                        <div className="absolute inset-0 bg-black/5 z-20 pointer-events-none rounded-2xl" />
                        <div className="relative h-56 overflow-hidden">
                          <ImageRotator images={getGallery(pkg.slug, pkg.image)} alt={pkg.title} subtleMotion={true} />
                          <div className="absolute inset-0 z-30 flex items-start justify-end p-4 pointer-events-none">
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                                <Sparkles className="w-3 h-3" />
                                <span className="text-xs font-bold uppercase tracking-wider">Coming Soon</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-10 left-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full z-30">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-xs font-semibold">{pkg.rating}</span>
                            <span className="text-white/60 text-xs">({pkg.reviewCount})</span>
                          </div>
                        </div>
                        <CardContent className="p-6 relative z-30">
                          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration} Days</span>
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {pkg.maxGroupSize}</span>
                          </div>
                          <h3 className="text-lg font-bold text-[#264653] mb-2 line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
                            {pkg.title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{pkg.shortDescription}</p>
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
                  </motion.div>
                );
              }

              return (
                <motion.div key={pkg.id} variants={itemVariants}>
                  <Link href={`/packages/${pkg.slug}`}>
                    <Card className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 rounded-2xl">
                      <div className="relative h-56 overflow-hidden">
                        <ImageRotator images={getGallery(pkg.slug, pkg.image)} alt={pkg.title} />
                        <div className="absolute top-4 right-4 z-30 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-[#0F4C75] font-bold text-sm">from ${Number(pkg.price).toLocaleString()}</span>
                        </div>
                        <div className="absolute bottom-10 left-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full z-30">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-xs font-semibold">{pkg.rating}</span>
                          <span className="text-white/60 text-xs">({pkg.reviewCount})</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.duration} Days</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {pkg.maxGroupSize}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#264653] mb-2 group-hover:text-[#0F4C75] transition-colors line-clamp-1" style={{ fontFamily: 'var(--font-heading)' }}>
                          {pkg.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{pkg.shortDescription}</p>
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
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/packages">
              <Button variant="outline" size="lg" className="border-[#0F4C75] text-[#0F4C75] hover:bg-[#0F4C75] hover:text-white rounded-full px-10 transition-all duration-300">
                View All Packages
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 relative overflow-hidden">
        {/* Dark textured background */}
        <div className="absolute inset-0 bg-[#1a2e35]" />
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "radial-gradient(circle at 30% 50%, rgba(244,162,97,0.15), transparent 60%), radial-gradient(circle at 80% 20%, rgba(42,157,143,0.15), transparent 50%)"}} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#F4A261] text-xs uppercase tracking-[0.3em] font-semibold">Why Travel With Us</span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-white mt-3"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              The Jemeka Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: "Expert Local Guides",
                description: "Our passionate local guides bring destinations to life with deep cultural insight, wildlife expertise and unforgettable stories.",
                color: "#F4A261",
              },
              {
                icon: Heart,
                title: "Personalized Journeys",
                description: "Every tour is tailored to your interests, pace and budget. We craft bespoke itineraries that feel uniquely yours.",
                color: "#2A9D8F",
              },
              {
                icon: Shield,
                title: "Safe & Responsible",
                description: "Your safety and the environment are our top priorities. All tours meet international safety standards and eco-tourism principles.",
                color: "#F4A261",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm h-full">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}20`, border: `1px solid ${feature.color}30` }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)'  }}>
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#2A9D8F] text-xs uppercase tracking-[0.3em] font-semibold">Testimonials</span>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#264653] mt-3"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              What Our Travelers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staticTestimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-[#F4A261]/20 mb-3" />
                    <p className="text-gray-600 leading-relaxed mb-6 italic">"{testimonial.comment}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0F4C75] to-[#2A9D8F] flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#264653] text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {testimonial.destination}
                        </div>
                      </div>
                      {testimonial.isVerified && (
                        <span className="ml-auto flex items-center gap-1 text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials">
              <Button variant="outline" size="lg" className="border-[#264653] text-[#264653] hover:bg-[#264653] hover:text-white rounded-full px-10 transition-all duration-300">
                Read All Reviews
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-home.jpg"
            alt="Start your journey"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C75]/95 via-[#0F4C75]/80 to-[#264653]/90" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-[#F4A261] text-xs uppercase tracking-[0.3em] font-semibold mb-4">Start Your Journey</span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              Ready for the
              <br />
              Adventure of a Lifetime?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Our travel experts are ready to craft your perfect African itinerary.
              From first inquiry to final farewell — we're with you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="group bg-[#F4A261] hover:bg-[#e08c4f] text-white px-10 py-7 text-lg font-semibold rounded-full shadow-2xl shadow-orange-500/30 hover:scale-105 transition-all duration-300"
                >
                  Plan My Trip
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-[#264653] backdrop-blur-sm px-10 py-7 text-lg font-semibold rounded-full transition-all duration-300"
                >
                  Browse Packages
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
