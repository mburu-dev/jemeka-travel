"use client";

import { useState } from "react";
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';


import { trpc } from "@/providers/trpc";
import { Layout } from "@jemeka/ui/components/Layout";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Input } from "@jemeka/ui/components/ui/input";
import { Label } from "@jemeka/ui/components/ui/label";
import { Badge } from "@jemeka/ui/components/ui/badge";
import { Separator } from "@jemeka/ui/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@jemeka/ui/components/ui/accordion";
import {
  Star,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  Check,
  X,
  Calendar,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PackageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading } = trpc.package.getBySlug.useQuery(
    { slug: slug! },
    { enabled: !!slug }
  );

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

  const bookingMutation = trpc.booking.create.useMutation({
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
    onError: (error) => {
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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#0F4C75] border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!pkg) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#264653] mb-4">
              Package Not Found
            </h1>
            <Link href="/packages">
              <Button className="bg-[#0F4C75]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const itinerary = pkg.itinerary as Array<{
    day: number;
    title: string;
    description: string;
  }> | null;
  const inclusions = pkg.inclusions as string[] | null;
  const exclusions = pkg.exclusions as string[] | null;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px]">
        <img
          src={pkg.image || "/images/packages/serengeti-classic.jpg"}
          alt={pkg.title}
          className="w-full h-full object-cover"
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
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#F4A261] text-white capitalize">
                {pkg.category}
              </Badge>
              <Badge className="bg-white/20 text-white capitalize">
                {pkg.difficulty}
              </Badge>
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
              {/* Quick Stats */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {[
                  { icon: Clock, label: "Duration", value: `${pkg.duration} Days` },
                  { icon: Users, label: "Group Size", value: `Max ${pkg.maxGroupSize}` },
                  { icon: Star, label: "Rating", value: `${pkg.rating}/5` },
                  { icon: MapPin, label: "Destination", value: pkg.destination?.name || "" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-0 shadow">
                    <CardContent className="p-4 text-center">
                      <stat.icon className="w-6 h-6 text-[#0F4C75] mx-auto mb-2" />
                      <div className="text-sm text-gray-500">{stat.label}</div>
                      <div className="font-semibold text-[#264653]">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2
                  className="text-2xl font-bold text-[#264653] mb-4"
                  style={{ fontFamily: 'var(--font-heading)'  }}
                >
                  Overview
                </h2>
                <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
              </motion.div>

              {/* Itinerary */}
              {itinerary && itinerary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2
                    className="text-2xl font-bold text-[#264653] mb-4"
                    style={{ fontFamily: 'var(--font-heading)'  }}
                  >
                    Itinerary
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {itinerary.map((day, i) => (
                      <AccordionItem
                        key={i}
                        value={`day-${i}`}
                        className="border rounded-lg px-4 bg-white shadow-sm"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-10 h-10 bg-[#0F4C75] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                              {day.day}
                            </div>
                            <span className="font-semibold text-[#264653]">
                              {day.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-14 text-gray-600">
                          {day.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {inclusions && inclusions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3
                      className="text-xl font-bold text-[#264653] mb-4 flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-heading)'  }}
                    >
                      <Check className="w-5 h-5 text-green-500" />
                      Inclusions
                    </h3>
                    <ul className="space-y-2">
                      {inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {exclusions && exclusions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3
                      className="text-xl font-bold text-[#264653] mb-4 flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-heading)'  }}
                    >
                      <X className="w-5 h-5 text-red-400" />
                      Exclusions
                    </h3>
                    <ul className="space-y-2">
                      {exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                          <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card className="border-0 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  {!showBookingForm ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-sm text-gray-500 mb-1">
                          Starting from
                        </div>
                        <div className="text-4xl font-bold text-[#0F4C75]">
                          ${Number(pkg.price).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-[#2A9D8F]" />
                          <span className="text-gray-600">
                            {pkg.duration} days / {pkg.duration - 1} nights
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="w-4 h-4 text-[#2A9D8F]" />
                          <span className="text-gray-600">
                            Max {pkg.maxGroupSize} travelers
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Sparkles className="w-4 h-4 text-[#2A9D8F]" />
                          <span className="text-gray-600 capitalize">
                            {pkg.difficulty} difficulty
                          </span>
                        </div>
                        {pkg.depositAmount && (
                          <div className="flex items-center gap-3 text-sm">
                            <Check className="w-4 h-4 text-[#2A9D8F]" />
                            <span className="text-gray-600">
                              Deposit: ${Number(pkg.depositAmount).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button
                        className="w-full bg-[#F4A261] hover:bg-[#e08c4f] text-white py-6 text-lg font-semibold"
                        onClick={() => setShowBookingForm(true)}
                      >
                        Book Now
                      </Button>

                      <p className="text-xs text-center text-gray-400 mt-3">
                        No hidden fees. Free cancellation within 48 hours.
                      </p>
                    </>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className="text-lg font-bold text-[#264653]"
                          style={{ fontFamily: 'var(--font-heading)'  }}
                        >
                          Book This Tour
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBookingForm(false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="travelDate">Travel Date *</Label>
                        <Input
                          id="travelDate"
                          type="date"
                          required
                          value={formData.travelDate}
                          onChange={(e) =>
                            setFormData({ ...formData, travelDate: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="adults">Adults *</Label>
                          <Input
                            id="adults"
                            type="number"
                            min={1}
                            max={pkg.maxGroupSize}
                            required
                            value={formData.adults}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                adults: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="children">Children</Label>
                          <Input
                            id="children"
                            type="number"
                            min={0}
                            value={formData.children}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                children: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="customerName">Full Name *</Label>
                        <Input
                          id="customerName"
                          required
                          placeholder="John Doe"
                          value={formData.customerName}
                          onChange={(e) =>
                            setFormData({ ...formData, customerName: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="customerEmail">Email *</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, customerEmail: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="customerPhone">Phone</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          placeholder="+1 234 567 890"
                          value={formData.customerPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, customerPhone: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requests</Label>
                        <Input
                          id="specialRequests"
                          placeholder="Dietary requirements, accessibility needs..."
                          value={formData.specialRequests}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specialRequests: e.target.value,
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Adults ({formData.adults} x ${Number(pkg.price).toLocaleString()})</span>
                          <span>${(formData.adults * Number(pkg.price)).toLocaleString()}</span>
                        </div>
                        {formData.children > 0 && (
                          <div className="flex justify-between">
                            <span>Children ({formData.children} x 50%)</span>
                            <span>${(formData.children * Number(pkg.price) * 0.5).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg text-[#0F4C75] pt-1">
                          <span>Total</span>
                          <span>${calculateTotal().toLocaleString()}</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#F4A261] hover:bg-[#e08c4f] text-white py-5 text-lg font-semibold"
                        disabled={bookingMutation.isPending}
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
    </Layout>
  );
}
