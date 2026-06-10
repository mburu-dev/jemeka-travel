"use client";

import { useState } from "react";
import Link from 'next/link';
import {
  Star,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Input } from "@jemeka/ui/components/ui/input";
import { Label } from "@jemeka/ui/components/ui/label";
import { Separator } from "@jemeka/ui/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@jemeka/ui/components/ui/accordion";
import Image from "next/image";
import { trpc } from "@/providers/trpc";

interface PackageDetailClientProps {
  pkg: any;
}

export default function PackageDetailClient({ pkg }: PackageDetailClientProps) {
  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    travelDate: "",
    adults: 1,
    children: 0,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: "",
  });

  const bookingMutation = (trpc as any).booking.create.useMutation({
    onSuccess: () => {
      toast.success("Booking submitted successfully! We will contact you soon.");
      setShowBookingForm(false);
      setFormData({
        travelDate: "",
        adults: 1,
        children: 0,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        specialRequests: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit booking");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    const totalPrice = (
      Number(pkg.price) * formData.adults +
      Number(pkg.price) * 0.5 * formData.children
    ).toFixed(2);

    bookingMutation.mutate({
      packageId: pkg.id,
      travelDate: formData.travelDate,
      adults: formData.adults,
      children: formData.children,
      totalPrice,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone || undefined,
      specialRequests: formData.specialRequests || undefined,
    });
  };

  const calculateTotal = () => {
    if (!pkg) return 0;
    return Number(pkg.price) * formData.adults + Number(pkg.price) * 0.5 * formData.children;
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px]">
        <Image
          src={pkg.image || "/images/packages/serengeti-classic.jpg"}
          alt={pkg.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/packages"
              className="inline-flex items-center text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Packages
            </Link>
            <div className="flex items-center gap-2 text-[#F4A261] text-sm mb-2">
              <Badge className="bg-[#F4A261] text-white">
                {pkg.category}
              </Badge>
              <span className="flex items-center gap-1 text-white">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {pkg.rating} ({pkg.reviewCount} reviews)
              </span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold text-white"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              {pkg.title}
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
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <Clock className="w-6 h-6 text-[#0F4C75] mb-2" />
                  <span className="text-xs text-gray-500 uppercase">Duration</span>
                  <span className="font-bold text-[#264653]">{pkg.duration} Days</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Users className="w-6 h-6 text-[#2A9D8F] mb-2" />
                  <span className="text-xs text-gray-500 uppercase">Group Size</span>
                  <span className="font-bold text-[#264653]">Max {pkg.maxGroupSize}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Sparkles className="w-6 h-6 text-[#F4A261] mb-2" />
                  <span className="text-xs text-gray-500 uppercase">Difficulty</span>
                  <span className="font-bold text-[#264653] capitalize">{pkg.difficulty}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <MapPin className="w-6 h-6 text-[#E76F51] mb-2" />
                  <span className="text-xs text-gray-500 uppercase">Location</span>
                  <span className="font-bold text-[#264653]">{pkg.destination?.name}</span>
                </div>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2
                  className="text-2xl font-bold text-[#264653] mb-4"
                  style={{ fontFamily: 'var(--font-heading)'  }}
                >
                  Overview
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {pkg.description}
                </p>
              </motion.div>

              {/* Itinerary */}
              {pkg.itinerary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-6"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    Itinerary
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {(pkg.itinerary as any[]).map((day, i) => (
                      <AccordionItem key={i} value={`day-${day.day}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 text-left">
                            <div className="bg-[#0F4C75] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                              {day.day}
                            </div>
                            <span className="font-bold text-[#264653]">
                              {day.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-14 text-gray-600 leading-relaxed">
                          {day.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-50 p-6 rounded-xl"
                >
                  <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5" /> What's Included
                  </h3>
                  <ul className="space-y-3">
                    {(pkg.inclusions as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-green-700">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-red-50 p-6 rounded-xl"
                >
                  <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5" /> What's Excluded
                  </h3>
                  <ul className="space-y-3">
                    {(pkg.exclusions as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-red-700">
                        <X className="w-4 h-4 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Sidebar / Booking Form */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl sticky top-24 overflow-hidden">
                <div className="bg-[#0F4C75] p-6 text-white">
                  <div className="text-sm opacity-80 mb-1">From</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${Number(pkg.price).toLocaleString()}
                    </span>
                    <span className="text-sm opacity-80">/ person</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  {!showBookingForm ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 pb-4 border-bottom border-gray-100">
                        <span>Deposit required</span>
                        <span className="font-bold text-[#264653]">
                          ${Number(pkg.depositAmount).toLocaleString()}
                        </span>
                      </div>
                      <Button
                        onClick={() => setShowBookingForm(true)}
                        className="w-full bg-[#F4A261] hover:bg-[#E76F51] text-white font-bold h-12"
                      >
                        Book This Tour
                      </Button>
                      <Link href="/contact" className="block">
                        <Button variant="outline" className="w-full h-12 border-[#0F4C75] text-[#0F4C75]">
                          Ask a Question
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[#264653]">Booking Details</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBookingForm(false)}
                          className="h-8 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travelDate">Travel Date</Label>
                        <Input
                          id="travelDate"
                          type="date"
                          required
                          value={formData.travelDate}
                          onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adults">Adults</Label>
                          <Input
                            id="adults"
                            type="number"
                            min="1"
                            required
                            value={formData.adults}
                            onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="children">Children (50%)</Label>
                          <Input
                            id="children"
                            type="number"
                            min="0"
                            required
                            value={formData.children}
                            onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          required
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={formData.customerEmail}
                          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        />
                      </div>

                      <div className="py-2 border-t border-b border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Total Price</span>
                          <span className="text-xl font-bold text-[#0F4C75]">
                            ${calculateTotal().toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={bookingMutation.isPending}
                        className="w-full bg-[#0F4C75] hover:bg-[#1B262C] text-white font-bold h-12"
                      >
                        {bookingMutation.isPending ? "Submitting..." : "Confirm Booking"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
