"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@jemeka/ui/components/ui/button";
import { Input } from "@jemeka/ui/components/ui/input";
import { Sparkles, Calendar, DollarSign, MapPin, Loader2, ArrowRight, Users, Lightbulb, CheckCircle, AlertCircle, Clock, Sun } from "lucide-react";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import Link from "next/link";

interface DayPlan {
  day: number;
  title: string;
  location: string;
  description: string;
  accommodation: string;
}

interface Itinerary {
  title: string;
  summary: string;
  estimatedCost: string;
  bestSeason: string;
  days: DayPlan[];
  tips: string[];
}

export default function PlannerClient() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState("");
  const [travelers, setTravelers] = useState("2 adults");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setItinerary(null);
    setError(null);

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, duration, interests, travelers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setItinerary(data.itinerary);
    } catch (err: any) {
      setError(err.message || "Could not generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#E76F51]/10 text-[#E76F51] px-4 py-2 rounded-full font-semibold text-sm mb-5"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#264653] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            AI Safari Planner
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Tell us your budget, travel dates, and interests — our AI will craft a personalized Kenya itinerary in seconds.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden sticky top-28">
              <div className="bg-[#264653] p-6">
                <h2 className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>Plan Your Trip</h2>
                <p className="text-white/70 text-sm mt-1">Fill in your preferences below</p>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Budget (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input required value={budget} onChange={e => setBudget(e.target.value)} type="number" placeholder="e.g. 2000" className="pl-9 h-11 bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Days)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input required value={duration} onChange={e => setDuration(e.target.value)} type="number" min="1" max="30" placeholder="e.g. 7" className="pl-9 h-11 bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Interest</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input required value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. Wildlife, Beach, Culture" className="pl-9 h-11 bg-gray-50 border-gray-200" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Wildlife Safari", "Beach Holiday", "Honeymoon", "Adventure", "Cultural"].map(tag => (
                        <button type="button" key={tag} onClick={() => setInterests(tag)}
                          className="text-xs bg-gray-100 hover:bg-[#E76F51]/10 hover:text-[#E76F51] text-gray-600 px-3 py-1 rounded-full transition-colors font-medium">
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Travelers</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input value={travelers} onChange={e => setTravelers(e.target.value)} placeholder="e.g. 2 adults, 1 child" className="pl-9 h-11 bg-gray-50 border-gray-200" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-[#E76F51] hover:bg-[#D65A3D] text-white h-12 text-base font-bold rounded-xl transition-all shadow-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Crafting your itinerary...
                      </>
                    ) : (
                      <>
                        Generate Itinerary
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {isGenerating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-96 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-[#E76F51]/10 flex items-center justify-center mb-6 animate-pulse">
                    <Sparkles className="w-10 h-10 text-[#E76F51]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#264653] mb-2">Our AI is designing your trip...</h3>
                  <p className="text-gray-500 max-w-xs">Analyzing the best Kenya destinations for your preferences.</p>
                </motion.div>
              )}

              {error && !isGenerating && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-start gap-4"
                >
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-800 mb-1">Could not generate itinerary</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              {itinerary && !isGenerating && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Trip Header */}
                  <div className="bg-gradient-to-br from-[#264653] to-[#1B3A47] text-white p-8 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 mb-3 text-[#F4A261] text-sm font-semibold">
                      <Sparkles className="w-4 h-4" /> AI-Generated Itinerary
                    </div>
                    <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{itinerary.title}</h2>
                    <p className="text-white/80 leading-relaxed mb-6">{itinerary.summary}</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-sm">
                        <DollarSign className="w-4 h-4 text-[#F4A261]" />
                        <span>{itinerary.estimatedCost}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-sm">
                        <Sun className="w-4 h-4 text-[#F4A261]" />
                        <span>{itinerary.bestSeason}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-sm">
                        <Clock className="w-4 h-4 text-[#F4A261]" />
                        <span>{itinerary.days.length} Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Day-by-Day */}
                  <div className="space-y-4">
                    {itinerary.days.map((day, idx) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.07 }}
                      >
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden">
                          <CardContent className="p-0 flex">
                            <div className="bg-[#2A9D8F] text-white w-16 flex-shrink-0 flex flex-col items-center justify-center p-4 text-center">
                              <div className="text-xs font-bold uppercase opacity-70">Day</div>
                              <div className="text-3xl font-black">{day.day}</div>
                            </div>
                            <div className="p-5">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-3.5 h-3.5 text-[#E76F51]" />
                                <span className="text-xs font-semibold text-[#E76F51] uppercase tracking-wider">{day.location}</span>
                              </div>
                              <h3 className="font-bold text-[#264653] text-lg mb-2">{day.title}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed mb-3">{day.description}</p>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                                <span className="font-medium">🏨</span> {day.accommodation}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tips */}
                  {itinerary.tips && itinerary.tips.length > 0 && (
                    <Card className="border-0 shadow-sm bg-amber-50 rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Lightbulb className="w-5 h-5 text-amber-600" />
                          <h3 className="font-bold text-amber-900">Expert Travel Tips</h3>
                        </div>
                        <ul className="space-y-3">
                          {itinerary.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                              <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* CTA */}
                  <Card className="border-0 shadow-lg bg-[#264653] rounded-2xl">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-white font-bold text-xl mb-2">Love this itinerary?</h3>
                      <p className="text-white/70 text-sm mb-5">Our team will refine every detail and handle all bookings for you.</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/contact">
                          <Button className="bg-[#E76F51] hover:bg-[#D65A3D] text-white px-8 h-12 font-bold rounded-xl">
                            Book This Trip
                          </Button>
                        </Link>
                        <Link href="/packages">
                          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 h-12 rounded-xl">
                            View Packages
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {!itinerary && !isGenerating && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-80 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
                >
                  <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Ready to explore?</h3>
                  <p className="text-gray-400 max-w-xs text-sm">Fill in your travel details on the left and our AI will create your perfect Kenya adventure.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
