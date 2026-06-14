"use client";

import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@jemeka/ui/components/ui/button";
import { Input } from "@jemeka/ui/components/ui/input";
import { Label } from "@jemeka/ui/components/ui/label";
import { Textarea } from "@jemeka/ui/components/ui/textarea";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    destinationInterest: "",
  });

  const enquiryMutation = trpc.enquiry.create.useMutation({
    onSuccess: () => {
      toast.success("Your message has been sent! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        destinationInterest: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enquiryMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject || undefined,
      message: formData.message,
      destinationInterest: formData.destinationInterest || undefined,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["PXH3+P46, Utawala, Mihango", "Nairobi, Kenya", "P.O. Box 46376-00100"],
      links: [],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+254 726 912577", "+254 704500872"],
      links: ["tel:+254726912577", "tel:+254704500872"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["njoros2025@gmail.com", "info@jemekatoursandtravel.com"],
      links: ["mailto:njoros2025@gmail.com", "mailto:info@jemekatoursandtravel.com"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Mon - Fri: 8AM - 6PM", "Sat: 9AM - 2PM"],
      links: [],
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="relative h-[35vh] min-h-[250px] flex items-center justify-center bg-[#0F4C75]">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/destinations/zanzibar.jpg"
            alt="Contact"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-heading)'  }}
          >
            Get in Touch
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Have a question or ready to plan your trip? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2
                  className="text-2xl font-bold text-[#264653] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-6">
                  Reach out to us through any of these channels. Our team is
                  always ready to help.
                </p>
              </motion.div>

              {/* MD Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0F4C75] to-[#264653] text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-[#F4A261]/20 border-2 border-[#F4A261] flex items-center justify-center text-[#F4A261] font-bold text-xl shrink-0">
                        GN
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#F4A261] font-semibold">Managing Director</p>
                        <h3 className="font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>George Githinji Njoroge</h3>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <a
                        href="tel:+254726912577"
                        className="flex items-center gap-3 text-white/90 hover:text-[#F4A261] transition-colors group"
                      >
                        <Phone className="w-4 h-4 text-[#2A9D8F] group-hover:text-[#F4A261] transition-colors" />
                        <span className="text-sm font-medium">+254 726 912577</span>
                      </a>
                      <a
                        href="mailto:njoros2025@gmail.com"
                        className="flex items-center gap-3 text-white/90 hover:text-[#F4A261] transition-colors group"
                      >
                        <Mail className="w-4 h-4 text-[#2A9D8F] group-hover:text-[#F4A261] transition-colors" />
                        <span className="text-sm font-medium">njoros2025@gmail.com</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + 1) * 0.1 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#0F4C75]/10 rounded-full flex items-center justify-center shrink-0">
                        <info.icon className="w-5 h-5 text-[#0F4C75]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#264653]">
                          {info.title}
                        </h3>
                        {info.details.map((detail, j) => (
                          info.links[j] ? (
                            <a
                              key={j}
                              href={info.links[j]}
                              className="block text-[#0F4C75] hover:text-[#F4A261] text-sm transition-colors"
                            >
                              {detail}
                            </a>
                          ) : (
                            <p key={j} className="text-gray-600 text-sm">{detail}</p>
                          )
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Social */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-[#0F4C75] to-[#264653]">
                <CardContent className="p-6 text-white text-center">
                  <Globe className="w-8 h-8 mx-auto mb-3 text-[#F4A261]" />
                  <h3 className="font-semibold mb-1">Follow Our Journey</h3>
                  <p className="text-white/80 text-sm">
                    Stay updated with our latest tours, travel tips, and
                    destination guides.
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {[
                      { name: "Facebook", url: "https://www.facebook.com/groups/686492314417258/", bg: "bg-[#1877F2] hover:bg-[#1877F2]/90 border-transparent" },
                      { name: "Instagram", url: "#", bg: "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 border-transparent" },
                      { name: "Twitter", url: "#", bg: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 border-transparent" }
                    ].map((social) => (
                      <a href={social.url} key={social.name} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="default"
                          size="sm"
                          className={`text-white transition-all ${social.bg}`}
                        >
                          {social.name}
                        </Button>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-[#0F4C75]" />
                    <h2
                      className="text-2xl font-bold text-[#264653]"
                      style={{ fontFamily: 'var(--font-heading)'  }}
                    >
                      Send Us a Message
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 234 567 890"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Booking Inquiry"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="destinationInterest">
                        Destination of Interest
                      </Label>
                      <Input
                        id="destinationInterest"
                        placeholder="e.g., Serengeti, Zanzibar"
                        value={formData.destinationInterest}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            destinationInterest: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        placeholder="Tell us about your travel plans, questions, or special requirements..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#F4A261] hover:bg-[#e08c4f] text-white px-8 py-5 text-lg"
                      disabled={enquiryMutation.isPending}
                    >
                      {enquiryMutation.isPending ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
