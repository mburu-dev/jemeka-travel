"use client";

import { useState, useEffect, useRef } from "react";

interface ImageRotatorProps {
  images: string[];
  alt: string;
  /** Whether to auto-play on load (default: false — plays on hover) */
  autoPlay?: boolean;
  /** Interval in ms between transitions (default: 3500) */
  interval?: number;
  /** Enables a slow, continuous zoom/pan effect for visual engagement */
  subtleMotion?: boolean;
  className?: string;
}

export function ImageRotator({
  images,
  alt,
  autoPlay = false,
  interval = 3500,
  subtleMotion = false,
  className = "",
}: ImageRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1 % images.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const validImages = images.filter(Boolean);

  const advance = () => {
    if (validImages.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % validImages.length;
        setNextIndex((next + 1) % validImages.length);
        return next;
      });
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    if ((autoPlay || isHovered) && validImages.length > 1) {
      timerRef.current = setInterval(advance, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, autoPlay, validImages.length, interval]);

  if (validImages.length === 0) return null;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current image */}
      <img
        src={validImages[currentIndex]}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
          isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
        } group-hover:scale-110`}
        style={
          subtleMotion && !isHovered
            ? { animation: "subtleZoom 20s infinite alternate ease-in-out" }
            : undefined
        }
        loading="lazy"
      />

      {/* Next image (preloaded behind) */}
      {validImages.length > 1 && (
        <img
          src={validImages[nextIndex]}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          loading="lazy"
          aria-hidden="true"
        />
      )}

      {/* Dot indicators — only show if multiple images */}
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (i !== currentIndex) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(i);
                    setNextIndex((i + 1) % validImages.length);
                    setIsTransitioning(false);
                  }, 300);
                }
              }}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 h-1.5 bg-white shadow-lg"
                  : "w-1.5 h-1.5 bg-white/60 hover:bg-white/90"
              }`}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hover play indicator (sparkle effect) */}
      {validImages.length > 1 && !isHovered && (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-0 pointer-events-none">
          <span className="text-white text-[10px] font-medium">✦ {validImages.length} photos</span>
        </div>
      )}

      {/* Photo count chip — always visible */}
      {validImages.length > 1 && (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <span className="text-white text-[10px] font-semibold tracking-wide">
            ✦ {currentIndex + 1}/{validImages.length}
          </span>
        </div>
      )}
    </div>
  );
}
