"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Compass, Calculator, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import { Button } from "@jemeka/ui/components/ui/button";

const AVAILABLE_DESTINATIONS = [
  { id: "masai-mara", name: "Masai Mara", pricePerDay: 400 },
  { id: "diani-beach", name: "Diani Beach", pricePerDay: 250 },
  { id: "amboseli", name: "Amboseli National Park", pricePerDay: 350 },
  { id: "lake-nakuru", name: "Lake Nakuru", pricePerDay: 300 },
  { id: "mount-kenya", name: "Mount Kenya", pricePerDay: 200 },
  { id: "samburu", name: "Samburu Reserve", pricePerDay: 380 },
  { id: "tsavo", name: "Tsavo National Park", pricePerDay: 320 },
];

export default function BuilderClient() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [daysPerDest, setDaysPerDest] = useState(3);

  const toggleDestination = (id: string) => {
    setSelectedDestinations(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    return selectedDestinations.reduce((total, id) => {
      const dest = AVAILABLE_DESTINATIONS.find(d => d.id === id);
      return total + (dest ? dest.pricePerDay * daysPerDest : 0);
    }, 0);
  };

  return (
    <div className="min-h-[80vh] pt-32 pb-20 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#0F4C75]/10 text-[#0F4C75] px-4 py-2 rounded-full font-semibold text-sm mb-6"
          >
            <Compass className="w-4 h-4" />
            Custom Package Builder
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#264653] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Build Your Own Adventure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Select the destinations you want to visit and we'll instantly calculate an estimated quote for your custom safari.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Destinations Selection */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-[#264653]" style={{ fontFamily: 'var(--font-heading)' }}>
              1. Choose Destinations
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {AVAILABLE_DESTINATIONS.map((dest, i) => {
                const isSelected = selectedDestinations.includes(dest.id);
                return (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    onClick={() => toggleDestination(dest.id)}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? "bg-[#2A9D8F]/10 border-[#2A9D8F] shadow-md" 
                        : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <h3 className={`font-bold text-lg mb-1 ${isSelected ? "text-[#2A9D8F]" : "text-gray-800"}`}>
                        {dest.name}
                      </h3>
                      <p className="text-gray-500 text-sm">~${dest.pricePerDay} / day</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#2A9D8F] text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      <Check className="w-5 h-5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-[#264653] text-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                    <Calculator className="w-6 h-6 text-[#E76F51]" />
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                      Estimated Quote
                    </h2>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">
                        Days Per Destination
                      </label>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setDaysPerDest(Math.max(1, daysPerDest - 1))}
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xl font-bold"
                        >-</button>
                        <span className="text-2xl font-bold w-12 text-center">{daysPerDest}</span>
                        <button 
                          onClick={() => setDaysPerDest(daysPerDest + 1)}
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xl font-bold"
                        >+</button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">
                        Selected Route ({selectedDestinations.length})
                      </div>
                      {selectedDestinations.length === 0 ? (
                        <p className="text-white/50 text-sm italic">No destinations selected yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {selectedDestinations.map(id => {
                            const dest = AVAILABLE_DESTINATIONS.find(d => d.id === id);
                            return (
                              <li key={id} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{dest?.name}</span>
                                <span className="text-[#F4A261]">${(dest?.pricePerDay || 0) * daysPerDest}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-end mb-8">
                      <span className="text-lg font-medium text-white/80">Total Estimate</span>
                      <span className="text-4xl font-black text-[#F4A261]">${calculateTotal().toLocaleString()}</span>
                    </div>

                    <Button 
                      disabled={selectedDestinations.length === 0}
                      className="w-full bg-[#E76F51] hover:bg-[#D65A3D] text-white h-14 text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Request Formal Quote
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-white/50 text-xs text-center mt-4">
                      * This is a rough estimate. Final prices vary by season, accommodation level, and group size.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
