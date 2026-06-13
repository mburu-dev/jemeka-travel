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
  Camera,
  PlayCircle,
  Quote
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import Image from "next/image";
import { ImageRotator } from "@/components/ImageRotator";
import { RequestQuoteForm } from "@/components/RequestQuoteForm";
import { ScrollPopup } from "@/components/ScrollPopup";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@jemeka/ui/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";

interface DestinationDetailClientProps {
  destination: any;
}

export default function DestinationDetailClient({ destination }: DestinationDetailClientProps) {
  // Use heroGallery if available, fallback to gallery, then image
  const galleryImages = destination.gallery?.length > 0 
    ? destination.gallery 
    : (destination.image ? [destination.image] : ["/images/destinations/serengeti.jpg"]);

  const isComingSoon = !destination.isActive;

  return (
    <>
      {/* Hero Section with ImageRotator */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        {galleryImages.length > 1 ? (
          <ImageRotator 
            images={galleryImages} 
            interval={5000} 
            className="w-full h-full object-cover" 
            subtleMotion={isComingSoon} 
          />
        ) : (
          <Image
            src={galleryImages[0]}
            alt={destination.name}
            fill
            className={`object-cover ${isComingSoon ? "animate-subtle-zoom" : ""}`}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/destinations"
              className="inline-flex items-center text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Destinations
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-[#F4A261] text-sm mb-3">
              <span className="flex items-center gap-1 font-semibold">
                <MapPin className="w-4 h-4" />
                {destination.country}
              </span>
              <Badge className="bg-white/20 text-white border-none ml-2">
                {destination.region}
              </Badge>
              {isComingSoon && (
                <Badge className="bg-amber-500 text-white border-none ml-2 shadow-lg animate-pulse">
                  Coming Soon
                </Badge>
              )}
            </div>
            <h1
              className="text-4xl sm:text-6xl font-bold text-white mb-2 drop-shadow-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {destination.name}
            </h1>
            {destination.shortDescription && (
              <p className="text-white/90 text-lg max-w-2xl mt-2 drop-shadow">
                {destination.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2
                  className="text-3xl font-bold text-[#264653] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Discover {destination.name}
                </h2>
                <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none">
                  {destination.description.split('\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </motion.div>

              {/* Experience Categories */}
              {destination.experienceCategories && destination.experienceCategories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-bold text-[#264653] mb-4">Vibe & Experience</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.experienceCategories.map((cat: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[#0F4C75] border-[#0F4C75] bg-white text-sm py-1 px-3">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-6 border-b pb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Trip Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(destination.highlights as string[]).map(
                      (highlight, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <Sparkles className="w-5 h-5 text-[#F4A261] shrink-0 mt-0.5" />
                          <span className="text-gray-700 font-medium">{highlight}</span>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* Wildlife/Attractions */}
              {destination.wildlife && destination.wildlife.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#264653] text-white p-8 rounded-2xl shadow-xl"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    <Camera className="w-6 h-6 text-[#F4A261]" />
                    What You'll See
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {destination.wildlife.map((item: string, i: number) => (
                      <span key={i} className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Video Experience */}
              {destination.videoExperienceUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-[#264653] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    <PlayCircle className="w-6 h-6 text-[#E76F51]" />
                    Experience {destination.name}
                  </h2>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black border border-gray-100">
                    <iframe 
                      src={destination.videoExperienceUrl} 
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </motion.div>
              )}

              {/* Activities */}
              {destination.activities && destination.activities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-6 border-b pb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Things To Do
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(destination.activities as string[]).map((activity, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-[#0F4C75]/10 text-[#0F4C75] px-4 py-2 text-sm hover:bg-[#0F4C75]/20 transition-colors"
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Testimonials */}
              {destination.destinationTestimonials && destination.destinationTestimonials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="pt-8 border-t border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-[#264653] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                    Traveler Stories
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {destination.destinationTestimonials.map((testimonial: any, idx: number) => (
                      <Card key={idx} className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <CardContent className="p-6 relative">
                          <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" />
                          <div className="flex gap-1 mb-3">
                            {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <p className="text-gray-600 italic mb-4 relative z-10">"{testimonial.quote}"</p>
                          <div className="font-semibold text-sm text-[#264653]">- {testimonial.author}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* FAQs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-8 border-t border-gray-200"
              >
                <h2 className="text-2xl font-bold text-[#264653] mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  <HelpCircle className="w-6 h-6 text-[#E76F51]" />
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {destination.bestTimeToVisit && (
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-semibold text-gray-800">What is the best time to visit {destination.name}?</AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed text-base">
                        The ideal time to experience {destination.name} is {destination.bestTimeToVisit}. During this period, weather conditions are optimal for activities and sightseeing.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {destination.activities && destination.activities.length > 0 && (
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-semibold text-gray-800">What activities are available?</AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed text-base">
                        You can enjoy a variety of activities including: {destination.activities.join(', ')}.
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-semibold text-gray-800">Can I customize my trip to {destination.name}?</AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed text-base">
                      Yes! All our tour packages to {destination.name} can be tailored to match your specific interests, budget, and travel dates. Feel free to request a custom quote.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>

              {/* Available Packages */}
              {destination.packages && destination.packages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="pt-8 border-t border-gray-200"
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-6"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Available Tour Packages
                  </h2>
                  <div className="space-y-4">
                    {destination.packages.map((pkg: any) => {
                      const PackageCard = (
                        <Card className={`group hover:shadow-xl transition-all duration-300 border border-gray-100 ${!pkg.isActive ? 'grayscale opacity-70' : 'cursor-pointer hover:-translate-y-1'}`}>
                          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center relative">
                            {!pkg.isActive && (
                              <div className="absolute top-3 right-3 z-10">
                                <Badge className="bg-amber-500 text-white text-[10px] uppercase tracking-wider shadow-md">
                                  Coming Soon
                                </Badge>
                              </div>
                            )}
                            <div className="relative w-full sm:w-40 h-48 sm:h-36 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={pkg.image || "/images/packages/serengeti-classic.jpg"}
                                alt={pkg.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                            </div>
                            <div className="flex-1 min-w-0 w-full py-1">
                              <h3 className="text-xl font-bold text-[#264653] group-hover:text-[#E76F51] transition-colors truncate mb-2">
                                {pkg.title}
                              </h3>
                              <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                {pkg.shortDescription || pkg.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 font-medium">
                                <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                                  <Clock className="w-3.5 h-3.5 text-[#0F4C75]" />
                                  {pkg.duration} Days
                                </span>
                                <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                                  <Users className="w-3.5 h-3.5 text-[#0F4C75]" />
                                  Max {pkg.maxGroupSize}
                                </span>
                              </div>
                            </div>
                            <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 gap-3">
                              {!isComingSoon && pkg.isActive && (
                                <div className="text-left sm:text-right">
                                  <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">From</div>
                                  <div className="text-[#0F4C75] font-black text-2xl">
                                    ${Number(pkg.price).toLocaleString()}
                                  </div>
                                </div>
                              )}
                              {pkg.isActive ? (
                                <Button className="bg-[#E76F51] hover:bg-[#D65A3D] text-white rounded-full px-6 w-full sm:w-auto transition-all shadow-sm group-hover:shadow-md">
                                  View Details
                                </Button>
                              ) : (
                                <Button disabled className="bg-gray-200 text-gray-500 rounded-full px-6 w-full sm:w-auto">
                                  Preview
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                      
                      return pkg.isActive ? (
                         <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="block">
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

            {/* Sidebar Sticky */}
            <div className="lg:sticky lg:top-24 space-y-6 self-start">
              {/* Quick Info Card */}
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
                <div className="bg-[#264653] p-6 text-white text-center sm:text-left">
                  <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Plan Your Trip
                  </h3>
                  <p className="text-white/80 text-sm mt-1">Key information at a glance</p>
                </div>
                <CardContent className="p-6 space-y-6">
                  {destination.bestTimeToVisit && (
                    <div className="flex items-start gap-4">
                      <div className="bg-[#E76F51]/10 p-3 rounded-xl shrink-0">
                        <Calendar className="w-6 h-6 text-[#E76F51]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                          Best Time to Visit
                        </div>
                        <div className="text-base font-medium text-gray-900">
                          {destination.bestTimeToVisit}
                        </div>
                      </div>
                    </div>
                  )}

                  {destination.durationRecommendations && (
                    <div className="flex items-start gap-4">
                      <div className="bg-[#0F4C75]/10 p-3 rounded-xl shrink-0">
                        <Clock className="w-6 h-6 text-[#0F4C75]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                          Recommended Duration
                        </div>
                        <div className="text-base font-medium text-gray-900">
                          {destination.durationRecommendations}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(!destination.bestTimeToVisit && !destination.durationRecommendations) && (
                    <div className="text-gray-500 text-sm text-center">
                      Detailed travel info coming soon.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inquiry Form */}
              <Card className="border-0 shadow-lg bg-[#F8F9FA] rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#264653] mb-4 border-b border-gray-200 pb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Inquire About {destination.name}
                  </h3>
                  <RequestQuoteForm destinationName={destination.name} />
                  
                  {/* WhatsApp CTA */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3 text-center">Need an immediate answer?</p>
                    <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white flex items-center justify-center gap-2 py-6 text-lg font-semibold rounded-xl shadow-md transition-transform hover:scale-[1.02]">
                        <MessageCircle className="w-5 h-5" />
                        Chat on WhatsApp
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>
      
      {/* Scroll Popup */}
      <ScrollPopup destinationName={destination.name} />
    </>
  );
}
