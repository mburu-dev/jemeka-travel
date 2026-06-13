"use client";

import { AppLayout as Layout } from "@/components/AppLayout";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Button } from "@jemeka/ui/components/ui/button";
import Link from 'next/link';

import {
  Heart,
  Globe,
  Award,
  Users,
  MapPin,
  ArrowRight,
  Shield,
  Leaf,
  HandHeart,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const values = [
  {
    icon: Heart,
    title: "Passion for Travel",
    description:
      "We are travelers at heart. Every itinerary we create is crafted with the same care and enthusiasm we put into our own adventures.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "No hidden fees, no surprises. We believe in complete transparency so you can plan your trip with confidence.",
  },
  {
    icon: Leaf,
    title: "Sustainable Tourism",
    description:
      "We are committed to responsible travel that benefits local communities and preserves the environments we explore.",
  },
  {
    icon: HandHeart,
    title: "Personalized Service",
    description:
      "Every traveler is unique. We take the time to understand your preferences and create journeys tailored just for you.",
  },
];

const stats = [
  { icon: Globe, value: "50+", label: "Destinations" },
  { icon: Users, value: "5000+", label: "Happy Travelers" },
  { icon: Award, value: "15+", label: "Industry Awards" },
  { icon: MapPin, value: "10+", label: "Years of Excellence" },
];

const team = [
  {
    name: "George Githinji Njoroge",
    role: "Founder & CEO",
    bio: "A passionate safari expert turned entrepreneur with extensive experience in African tourism.",
    image: "/images/team/george-githinji.webp",
  },
  {
    name: "Joseph Kiai",
    role: "Head of Operations",
    bio: "Expert logistics coordinator ensuring every journey runs smoothly from start to finish.",
    image: "/images/team/joseph-kiai.webp",
  },
  {
    name: "Margaret Njoroge",
    role: "Lead Safari Guide",
    bio: "Certified wilderness expert with an encyclopedic knowledge of African wildlife and ecosystems.",
    image: "/images/team/margaret-njoroge.webp",
  },
  {
    name: "Phyllis Kamau",
    role: "Customer Experience",
    bio: "Dedicated to making sure every traveler has an unforgettable and seamless experience.",
    image: "/images/team/phyllis.webp",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <Image
          src="/images/destinations/masai-mara-2.jpg"
          alt="About Jemeka"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#264653]/90 to-[#0F4C75]/80" />
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)'  }}
          >
            About Jemeka Tours
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Your trusted partner in creating extraordinary travel experiences
            since 2015.
          </p>
        </div>
      </section>

      {/* Our Story - Luxury Cinematic Layout */}
      <section className="bg-white">
        {/* Chapter 1: The Epiphany */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 lg:sticky lg:top-32"
            >
              <span className="text-[#F4A261] text-xs uppercase tracking-[0.3em] font-bold mb-4 block">
                Chapter I
              </span>
              <h2
                className="text-4xl sm:text-6xl font-bold text-[#264653] leading-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Born from the Red Soil of Kenya
              </h2>
              <div className="w-20 h-1 bg-[#F4A261] rounded-full"></div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-8 text-lg text-gray-600 leading-relaxed"
            >
              <p className="text-2xl text-[#264653] font-medium leading-snug first-letter:text-7xl first-letter:font-bold first-letter:text-[#0F4C75] first-letter:mr-3 first-letter:float-left first-line:uppercase first-line:tracking-widest">
                Jemeka Tours & Travel was not born in a corporate boardroom. It was conceived under the vast, star-studded skies of the Masai Mara, amidst the distant roar of lions and the crackle of a campfire.
              </p>
              <p>
                Our founders, native to this breathtaking land, grew up with a profound, almost spiritual connection to the untamed wilderness and vibrant cultures of Kenya. We spent our early years exploring hidden trails, tracking wildlife through the morning mist, and listening to the ancient stories passed down by local elders.
              </p>
              <p>
                We realized that the typical "safari" had become commodified—a checklist of animals viewed through the dusty windows of crowded minivans. We wanted to change that. We wanted to share the true, unfiltered heartbeat of Africa. We envisioned a travel company that didn't just show you the sights, but allowed you to feel the soul of the continent.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Chapter 2: The Philosophy */}
        <div className="w-full relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <Image
            src="/images/destinations/amboseli-2.jpg" 
            alt="The African Wilderness"
            fill
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto px-4 text-center"
          >
             <Heart className="w-12 h-12 text-[#F4A261] mx-auto mb-8 opacity-80" />
             <h3 
               className="text-3xl sm:text-5xl font-light text-white leading-tight italic"
               style={{ fontFamily: 'var(--font-heading)' }}
             >
               "We believe luxury isn't found in thread counts or gold fixtures. True luxury is the privilege of authentic connection, the rarity of untouched wilderness, and the profound peace of belonging to something greater than yourself."
             </h3>
          </motion.div>
        </div>

        {/* Chapter 3: The Evolution */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/destinations/masai-mara-4.jpg"
                alt="Safari Journey"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#264653]/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <div className="text-5xl font-bold mb-2 text-[#F4A261]">10+</div>
                <div className="text-lg font-medium text-white/90 uppercase tracking-wider">Years Crafting Masterpieces</div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-8 text-lg text-gray-600 leading-relaxed"
            >
              <span className="text-[#0F4C75] text-xs uppercase tracking-[0.3em] font-bold mb-4 block">
                Chapter II
              </span>
              <h2
                className="text-4xl sm:text-5xl font-bold text-[#264653] leading-tight mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Curators of the Extraordinary
              </h2>
              <p>
                From those humble, passionate beginnings, Jemeka Tours has evolved into one of East Africa's premier luxury travel outfitters. Today, we don't just operate in Kenya; we meticulously curate cross-border expeditions spanning the continent's most pristine landscapes.
              </p>
              <p>
                Yet, despite our growth, our core ethos remains fiercely unchanged. We are still that passionate team of locals. We still personally vet every lodge, handpick every guide, and test every route. We believe that a great journey requires a master orchestrator behind the scenes—someone who handles the complex logistics flawlessly so that you can remain fully immersed in the magic of the moment.
              </p>
              <p className="font-semibold text-[#264653] text-xl italic pt-4 border-t border-gray-200">
                When you travel with Jemeka, you aren't just a client; you are our honored guest, and we are thrilled to welcome you home.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#0F4C75]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <stat.icon className="w-10 h-10 text-[#F4A261] mx-auto mb-3" />
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#2A9D8F] text-sm uppercase tracking-[0.2em] font-medium">
              What We Stand For
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#264653] mt-2"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-[#0F4C75]/10 rounded-full flex items-center justify-center mb-4">
                      <value.icon className="w-7 h-7 text-[#0F4C75]" />
                    </div>
                    <h3
                      className="text-xl font-bold text-[#264653] mb-2"
                      style={{ fontFamily: 'var(--font-heading)'  }}
                    >
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#2A9D8F] text-sm uppercase tracking-[0.2em] font-medium">
              Our People
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#264653] mt-2"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              Meet the Team
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    {member.image ? (
                      <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#2A9D8F]/20 shadow-inner">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 bg-gradient-to-br from-[#0F4C75] to-[#2A9D8F] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-[#2A9D8F]/20">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <h3
                      className="text-lg font-bold text-[#264653]"
                      style={{ fontFamily: 'var(--font-heading)'  }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-[#2A9D8F] text-sm font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#264653]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              Start Your Journey With Us
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Whether you're dreaming of an African safari, a beach paradise, or
              a cultural adventure, we're here to make it happen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/packages">
                <Button
                  size="lg"
                  className="bg-[#F4A261] hover:bg-[#e08c4f] text-white px-8 rounded-full"
                >
                  Explore Packages
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-[#264653] px-8 rounded-full"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
