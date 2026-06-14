"use client";

import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { AppLayout as Layout } from "@/components/AppLayout";
import { Button } from "@jemeka/ui/components/ui/button";
import { Input } from "@jemeka/ui/components/ui/input";
import { Label } from "@jemeka/ui/components/ui/label";
import { Textarea } from "@jemeka/ui/components/ui/textarea";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import {
  Star,
  Quote,
  Send,
  MessageSquare,
  CheckCircle,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";

export default function Testimonials() {
  const { data: testimonialsData, isLoading } = trpc.testimonial.list.useQuery({});
  const testimonials = testimonialsData?.items;
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    destination: "",
  });

  const createTestimonial = trpc.testimonial.create.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your review! It will appear after verification.");
      setShowForm(false);
      setFormData({ name: "", email: "", rating: 5, comment: "", destination: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTestimonial.mutate(formData);
  };

  const averageRating = testimonials?.length
    ? (
        (testimonials as { rating: number }[]).reduce((sum: number, t: { rating: number }) => sum + t.rating, 0) /
        testimonials.length
      ).toFixed(1)
    : "0";

  return (
    <Layout>
      {/* Header */}
      <section className="relative h-[35vh] min-h-[250px] flex items-center justify-center bg-[#264653]">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/packages/kruger-safari.jpg"
            alt="Testimonials"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)'  }}
          >
            Traveler Stories
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Hear from our happy travelers about their unforgettable journeys.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <span className="text-3xl font-bold text-[#264653]">
                  {averageRating}
                </span>
              </div>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#264653]">
                {testimonialsData?.items?.length || 0}
              </div>
              <p className="text-gray-500 text-sm">Total Reviews</p>
            </div>
            <div className="w-px h-12 bg-gray-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#264653]">98%</div>
              <p className="text-gray-500 text-sm">Recommend Us</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2
              className="text-3xl font-bold text-[#264653]"
              style={{ fontFamily: 'var(--font-heading)'  }}
            >
              What Travelers Say
            </h2>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#F4A261] hover:bg-[#e08c4f]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </div>

          {/* Review Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-10"
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#264653]">
                      Share Your Experience
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reviewerName">Name *</Label>
                        <Input
                          id="reviewerName"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="reviewerEmail">Email *</Label>
                        <Input
                          id="reviewerEmail"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="destination">Destination Visited</Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Serengeti, Tanzania"
                        value={formData.destination}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            destination: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, rating: star })
                            }
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= formData.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {formData.rating}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review *</Label>
                      <Textarea
                        id="comment"
                        required
                        rows={4}
                        placeholder="Share your experience with us..."
                        value={formData.comment}
                        onChange={(e) =>
                          setFormData({ ...formData, comment: e.target.value })
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-[#0F4C75] hover:bg-[#0a3a5a]"
                      disabled={createTestimonial.isPending}
                    >
                      {createTestimonial.isPending
                        ? "Submitting..."
                        : "Submit Review"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Reviews Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse h-48 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials?.map((testimonial: any, index: number) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Quote className="w-10 h-10 text-[#F4A261]/30 mb-4" />
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {testimonial.comment}
                      </p>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <div className="w-10 h-10 rounded-full bg-[#0F4C75] flex items-center justify-center text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[#264653]">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {testimonial.destination}
                          </div>
                        </div>
                        {testimonial.isVerified && (
                          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
