"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin } from "lucide-react";
import { Button } from "@jemeka/ui/components/ui/button";
import { Card, CardContent } from "@jemeka/ui/components/ui/card";
import Link from "next/link";

interface ScrollPopupProps {
  destinationName?: string;
}

export function ScrollPopup({ destinationName }: ScrollPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasDismissed) return;
      
      const scrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      // Show after scrolling 50% of the page
      if (scrollPercentage > 50 && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasDismissed, isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-24 right-4 sm:right-8 z-50 w-[90vw] max-w-[360px]"
        >
          <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden relative">
            {/* Close Button */}
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
            
            <div className="bg-[#264653] p-5 pb-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2A9D8F]/20 rounded-full blur-2xl"></div>
              <h3 className="text-white font-bold text-xl leading-tight pr-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Planning a trip{destinationName ? ` to ${destinationName}` : ' to Kenya'}?
              </h3>
            </div>
            
            <CardContent className="p-5 -mt-4 relative bg-white rounded-t-2xl">
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Get a free customized itinerary tailored to your budget and interests from our local experts.
              </p>
              
              <div className="space-y-3">
                <Link href="/planner" className="block w-full">
                  <Button className="w-full bg-[#E76F51] hover:bg-[#D65A3D] text-white flex items-center justify-center gap-2 rounded-xl shadow-md h-11">
                    <Calendar className="w-4 h-4" />
                    Get Custom Itinerary
                  </Button>
                </Link>
                <Link href="/packages" className="block w-full">
                  <Button variant="outline" className="w-full text-[#264653] border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 rounded-xl h-11">
                    <MapPin className="w-4 h-4" />
                    Browse Existing Packages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
