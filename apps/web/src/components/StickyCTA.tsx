"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@jemeka/ui/components/ui/button";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[320px] sm:max-w-md sm:right-6 sm:left-auto sm:translate-x-0"
        >
          <div className="bg-white rounded-full shadow-2xl p-2 flex items-center justify-between border border-gray-100">
            <a 
              href="https://wa.me/254704500872" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex justify-center"
            >
              <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700">
                <MessageCircle className="w-5 h-5" />
                <span className="sr-only">WhatsApp Us</span>
              </Button>
            </a>
            
            <div className="w-px h-8 bg-gray-200 mx-1"></div>

            <a 
              href="tel:+254704500872"
              className="flex-1 flex justify-center"
            >
              <Button size="icon" variant="ghost" className="rounded-full w-12 h-12 bg-blue-50 hover:bg-blue-100 text-[#0F4C75] hover:text-[#1B262C]">
                <Phone className="w-5 h-5" />
                <span className="sr-only">Call Us</span>
              </Button>
            </a>

            <div className="w-px h-8 bg-gray-200 mx-1"></div>

            <Link href="/contact" className="flex-1 flex justify-center">
              <Button className="rounded-full bg-[#E76F51] hover:bg-[#D65A3D] text-white px-6 h-12 shadow-md">
                Enquire Now
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
