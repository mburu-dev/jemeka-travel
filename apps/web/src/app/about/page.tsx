"use client";

import { Layout } from "@jemeka/ui/components/Layout";
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
    name: "James Mwangi",
    role: "Founder & CEO",
    bio: "A passionate safari guide turned entrepreneur with 20+ years of experience in African tourism.",
  },
  {
    name: "Sarah Chen",
    role: "Head of Operations",
    bio: "Expert logistics coordinator ensuring every journey runs smoothly from start to finish.",
  },
  {
    name: "David Okafor",
    role: "Lead Safari Guide",
    bio: "Certified wilderness expert with an encyclopedic knowledge of African wildlife and ecosystems.",
  },
  {
    name: "Emma Thompson",
    role: "Customer Experience",
    bio: "Dedicated to making sure every traveler has an unforgettable and seamless experience.",
  },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <img
          src="/images/about-hero.jpg"
          alt="About Jemeka"
          className="absolute inset-0 w-full h-full object-cover"
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

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#2A9D8F] text-sm uppercase tracking-[0.2em] font-medium">
                Our Story
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#264653] mt-2 mb-6"
                style={{ fontFamily: 'var(--font-heading)'  }}
              >
                Born from a Love of Adventure
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Jemeka Tours & Travel was founded in 2015 by James Mwangi, a
                  former safari guide who dreamed of sharing the magic of Africa
                  with the world. What started as a small operation in Arusha,
                  Tanzania has grown into one of East Africa's most trusted tour
                  operators.
                </p>
                <p>
                  Our name "Jemeka" comes from a Swahili phrase meaning "to
                  journey together" - and that's exactly what we do. We journey
                  alongside our travelers, crafting experiences that go beyond
                  typical tourism to create genuine connections with places,
                  people, and wildlife.
                </p>
                <p>
                  Today, we operate across 50+ destinations in Africa and
                  beyond, offering everything from luxury safaris to budget
                  adventures, cultural immersions to beach getaways. But no
                  matter how much we grow, our core mission remains the same:
                  creating transformative travel experiences that leave both our
                  guests and the destinations they visit better than before.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/destinations/serengeti.jpg"
                alt="Safari"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#0F4C75] text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-white/80 text-sm">Years of Excellence</div>
              </div>
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
                    <div className="w-20 h-20 bg-gradient-to-br from-[#0F4C75] to-[#2A9D8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {member.name.charAt(0)}
                    </div>
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
                  className="border-white text-white hover:bg-white hover:text-[#264653] px-8 rounded-full"
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
