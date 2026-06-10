"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@jemeka/ui/components/ui/button";
import { Globe } from "lucide-react";

const regions = [
  { value: "", label: "All Regions" },
  { value: "africa", label: "Africa" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "americas", label: "Americas" },
  { value: "oceania", label: "Oceania" },
];

export default function DestinationsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get('region') || "";

  const handleRegionChange = (region: string) => {
    const params = new URLSearchParams(searchParams);
    if (region) {
      params.set('region', region);
    } else {
      params.delete('region');
    }
    router.push(`/destinations?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      <Globe className="w-5 h-5 text-[#0F4C75] shrink-0" />
      {regions.map((region) => (
        <Button
          key={region.value}
          variant={selectedRegion === region.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleRegionChange(region.value)}
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
  );
}
