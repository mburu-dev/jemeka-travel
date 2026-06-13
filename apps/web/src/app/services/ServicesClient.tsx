"use client";

import { motion } from "framer-motion";
import {
  Binoculars, Waves, Heart, Users, Briefcase, GraduationCap,
  Church, Mountain, Globe, Plane, Car, Building2, Ticket,
  Ship, FileText, Shield, CalendarRange, Star, Crown, ArrowRight, Sparkles
} from "lucide-react";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Button } from "@jemeka/ui/components/ui/button";
import Link from "next/link";

const SERVICE_CATEGORIES = [
  {
    category: "Core Tour Experiences",
    description: "Our signature Kenyan and international tour products",
    color: "from-[#264653] to-[#2A9D8F]",
    iconColor: "text-[#2A9D8F]",
    bgColor: "bg-[#2A9D8F]/10",
    services: [
      { icon: Binoculars, title: "Safari Packages", description: "Expertly crafted wildlife safaris across Kenya's iconic parks — Masai Mara, Amboseli, Tsavo and beyond. Big Five encounters guaranteed." },
      { icon: Waves, title: "Beach Holidays", description: "Luxurious coastal retreats to Diani Beach, Watamu, Lamu, and Malindi. All-inclusive, honeymoon, and family-focused options available." },
      { icon: Mountain, title: "Adventure Tours", description: "Thrilling experiences including Mount Kenya climbing, Hell's Gate cycling, white-water rafting in Sagana, and canopy walks." },
      { icon: Globe, title: "Cultural Tours", description: "Immersive journeys into Kenya's rich heritage — Maasai villages, Swahili coastal culture, Samburu traditions, and UNESCO heritage sites." },
      { icon: Crown, title: "Luxury VIP Travel", description: "Private helicopter transfers, exclusive conservancy safaris, fly-in camps, luxury lodge bookings, and bespoke VIP itineraries." },
      { icon: Globe, title: "International Tour Packages", description: "Curated escapes to Zanzibar, Victoria Falls, Serengeti, Kruger Park, Santorini, Dubai, and beyond." },
    ],
  },
  {
    category: "Specialized Packages",
    description: "Tailored experiences for every type of traveler",
    color: "from-[#E76F51] to-[#F4A261]",
    iconColor: "text-[#E76F51]",
    bgColor: "bg-[#E76F51]/10",
    services: [
      { icon: Heart, title: "Honeymoon Packages", description: "Romantic getaways to Diani Beach, Lamu, Watamu, and luxury Mara camps. Private candlelit dinners, couples' spa, and surprise arrangements." },
      { icon: Users, title: "Family Vacations", description: "Kid-friendly itineraries combining wildlife, beaches, and engaging cultural activities with suitable accommodation for all ages." },
      { icon: Briefcase, title: "Corporate Retreats", description: "Team-building experiences, incentive travel, and strategic retreats in Kenya's most inspiring destinations." },
      { icon: GraduationCap, title: "Educational Tours", description: "Structured learning journeys for schools and universities covering conservation, culture, history, and ecology." },
      { icon: Church, title: "Pilgrimage Tours", description: "Spiritual journeys to sacred sites including Subukia Shrine and heritage religious destinations across East Africa." },
      { icon: Mountain, title: "Mountain Climbing Packages", description: "Guided ascents of Mount Kenya via multiple routes — Sirimon, Naro Moru, and Chogoria. All equipment and experienced guides provided." },
    ],
  },
  {
    category: "Logistics & Support Services",
    description: "Everything you need to make your journey seamless",
    color: "from-[#0F4C75] to-[#264653]",
    iconColor: "text-[#0F4C75]",
    bgColor: "bg-[#0F4C75]/10",
    services: [
      { icon: Plane, title: "Airport Transfers", description: "Reliable, comfortable airport pickup and drop-off in JKIA, Mombasa, and Wilson Airport. Available 24/7 with professional drivers." },
      { icon: Car, title: "Car Hire Services", description: "Self-drive and chauffeur-driven vehicles including 4x4 safari land cruisers, minivans, saloons, and luxury SUVs." },
      { icon: Building2, title: "Hotel Bookings", description: "Access to our curated network of hotels, lodges, and camps across Kenya at negotiated rates. Budget to ultra-luxury options." },
      { icon: Ticket, title: "Flight Reservations", description: "Domestic and international flight booking assistance with access to the best fares from Nairobi's airports." },
      { icon: Ship, title: "Cruise Packages", description: "Indian Ocean cruise experiences and dhow dinner cruises along the Kenyan coast." },
      { icon: FileText, title: "Visa Assistance", description: "End-to-end guidance on Kenya e-visa applications and entry requirements for all nationalities." },
      { icon: Shield, title: "Travel Insurance", description: "Comprehensive travel insurance packages covering medical emergencies, trip cancellation, and lost luggage." },
      { icon: CalendarRange, title: "Conference & Event Travel", description: "Full logistics management for conference delegates, group travel coordination, and MICE tourism services." },
    ],
  },
];

export default function ServicesClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#1B262C] via-[#264653] to-[#2A9D8F] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#E76F51] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4A261] rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 text-[#F4A261]" />
            20 Comprehensive Travel Services
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Everything You Need<br />For Your Perfect Trip
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
            From the moment you decide to travel to the moment you return home, Jemeka Tours handles every detail with expert care and passion.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-[#E76F51] hover:bg-[#D65A3D] text-white h-14 px-10 text-lg font-bold rounded-full shadow-lg shadow-[#E76F51]/30">
                Get a Free Quote
              </Button>
            </Link>
            <Link href="/packages">
              <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-10 text-lg rounded-full">
                Browse Packages
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {SERVICE_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.category}>
              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${cat.color} text-white px-5 py-2 rounded-full text-sm font-bold mb-4`}>
                  {cat.category}
                </div>
                <p className="text-gray-500 text-lg">{cat.description}</p>
                <div className="w-20 h-1 bg-gradient-to-r from-[#E76F51] to-[#F4A261] rounded-full mt-4" />
              </motion.div>

              {/* Services Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.services.map((service, idx) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-1">
                      <CardContent className="p-7">
                        <div className={`w-14 h-14 ${cat.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                          <service.icon className={`w-7 h-7 ${cat.iconColor}`} />
                        </div>
                        <h3 className="text-xl font-bold text-[#264653] mb-3 group-hover:text-[#E76F51] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-5">
                          {service.description}
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E76F51] hover:gap-3 transition-all">
                          Enquire Now <ArrowRight className="w-4 h-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#264653] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Not Sure Where to Start?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Let our AI planner or our expert team design the perfect bespoke itinerary for you — completely free with no obligation.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planner">
              <Button className="bg-[#E76F51] hover:bg-[#D65A3D] text-white h-14 px-10 text-lg font-bold rounded-full">
                <Sparkles className="w-5 h-5 mr-2" />
                Try AI Planner
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-10 text-lg rounded-full">
                Talk to an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
