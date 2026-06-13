"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

// The path to the TopoJSON file in the public directory
const geoUrl = "/data/kenya.topojson";

interface DestinationMarker {
  id: string | number;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  region: string;
  slug: string;
}

interface InteractiveMapProps {
  markers?: DestinationMarker[];
  onMarkerClick?: (slug: string) => void;
}

export function InteractiveMap({ markers = [] }: InteractiveMapProps) {
  const router = useRouter();
  const [tooltipContent, setTooltipContent] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mapConfig, setMapConfig] = useState({
    center: [38, 0] as [number, number],
    zoom: 1
  });

  const handleMouseEnter = (name: string, e: React.MouseEvent) => {
    setTooltipContent(name);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const handleMarkerClick = (slug: string, coordinates: [number, number]) => {
    setMapConfig({ center: coordinates, zoom: 4 });
    setTimeout(() => {
      router.push(`/destinations/${slug}`);
    }, 600);
  };

  return (
    <div className="relative w-full h-full bg-[#1B262C]/5 rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3000,
          center: [38, 0], // Base projection center
        }}
        className="w-full h-full"
      >
        <ZoomableGroup 
          center={mapConfig.center} 
          zoom={mapConfig.zoom} 
          minZoom={1} 
          maxZoom={6}
          onMoveEnd={(position) => setMapConfig({ center: position.coordinates as [number, number], zoom: position.zoom })}
          className="transition-all duration-700 ease-in-out"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#0F4C75"
                  fillOpacity={0.15}
                  stroke="#0F4C75"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#0F4C75", fillOpacity: 0.3, outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map(({ id, name, coordinates, slug }) => (
            <Marker key={id} coordinates={coordinates} onClick={() => handleMarkerClick(slug, coordinates)}>
              <g
                className="cursor-pointer transition-transform hover:scale-125 origin-bottom"
                onMouseEnter={(e) => handleMouseEnter(name, e)}
                onMouseLeave={handleMouseLeave}
              >
                <circle cx="0" cy="0" r="14" fill="#E76F51" fillOpacity={0.2} className="animate-ping" />
                <MapPin className="text-[#E76F51]" x="-12" y="-24" width="24" height="24" strokeWidth={2.5} />
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed z-50 px-4 py-2 bg-[#264653] text-white text-sm font-bold rounded-lg shadow-xl pointer-events-none whitespace-nowrap"
          style={{
            left: position.x,
            top: position.y - 40,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltipContent}
          <div className="absolute left-1/2 -bottom-2 w-0 h-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#264653]" />
        </motion.div>
      )}
    </div>
  );
}
