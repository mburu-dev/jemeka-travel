"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@jemeka/ui/components/ui/button";
import { Globe, Map, Sparkles } from "lucide-react";
import { useState } from 'react';

const regions = [
  { value: "", label: "All Regions" },
  { value: "africa", label: "Africa" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "americas", label: "Americas" },
  { value: "oceania", label: "Oceania" },
];

const experiences = [
  { value: "", label: "All Experiences" },
  { value: "Wildlife", label: "Wildlife" },
  { value: "Cultural", label: "Cultural" },
  { value: "Luxury", label: "Luxury" },
  { value: "Adventure", label: "Adventure" },
  { value: "Beach", label: "Beach & Coast" },
  { value: "Honeymoon", label: "Honeymoon" },
];

export default function DestinationsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get('region') || "";
  const selectedExperience = searchParams.get('experience') || "";
  
  const [activeTab, setActiveTab] = useState<"region" | "experience">(
    selectedExperience ? "experience" : "region"
  );

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // If switching main filter type, clear the other to avoid conflicting zero-results
    if (key === 'region') params.delete('experience');
    if (key === 'experience') params.delete('region');
    
    router.push(`/destinations?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("region")}
          className={`flex items-center gap-2 pb-3 font-medium transition-colors ${
            activeTab === "region" 
              ? "text-[#0F4C75] border-b-2 border-[#0F4C75]" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Globe className="w-4 h-4" />
          By Region
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-2 pb-3 font-medium transition-colors ${
            activeTab === "experience" 
              ? "text-[#E76F51] border-b-2 border-[#E76F51]" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          By Experience
        </button>
      </div>

      {/* Filter Options */}
      {activeTab === "region" && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Map className="w-5 h-5 text-gray-400 shrink-0" />
          {regions.map((region) => (
            <Button
              key={region.value}
              variant={selectedRegion === region.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('region', region.value)}
              className={`rounded-full whitespace-nowrap ${
                selectedRegion === region.value
                  ? "bg-[#0F4C75] text-white"
                  : "text-gray-600 hover:text-[#0F4C75]"
              }`}
            >
              {region.label}
            </Button>
          ))}
        </div>
      )}

      {activeTab === "experience" && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Sparkles className="w-5 h-5 text-gray-400 shrink-0" />
          {experiences.map((exp) => (
            <Button
              key={exp.value}
              variant={selectedExperience === exp.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('experience', exp.value)}
              className={`rounded-full whitespace-nowrap ${
                selectedExperience === exp.value
                  ? "bg-[#E76F51] text-white"
                  : "text-gray-600 hover:text-[#E76F51]"
              }`}
            >
              {exp.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
