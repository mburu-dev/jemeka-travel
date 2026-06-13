"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface HeroSlideshowProps {
  totalSlides: number;
}

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Transition variants — randomized non-consecutively */
const TRANSITIONS = ["fade", "zoomPan", "crossBlur"] as const;
type TransitionType = (typeof TRANSITIONS)[number];

const transitionVariants: Record<TransitionType, any> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.6, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 1.4, ease: "easeInOut" } },
  },
  zoomPan: {
    initial: { opacity: 0, scale: 1.12, x: 24 },
    animate: { opacity: 1, scale: 1, x: 0, transition: { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, scale: 0.96, x: -24, transition: { duration: 1.4, ease: "easeIn" } },
  },
  crossBlur: {
    initial: { opacity: 0, filter: "blur(12px)" },
    animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 1.6 } },
    exit: { opacity: 0, filter: "blur(12px)", transition: { duration: 1.4 } },
  },
};

/** Per-slide ambient motion — subtle continuous Ken Burns / drift */
const AMBIENT_PRESETS = [
  // Slow zoom in
  { scale: [1, 1.06], x: [0, 0], y: [0, 0], rotate: [0, 0] },
  // Slow zoom out
  { scale: [1.06, 1], x: [0, 0], y: [0, 0], rotate: [0, 0] },
  // Drift right + slight zoom
  { scale: [1, 1.04], x: [0, 20], y: [0, 0], rotate: [0, 0] },
  // Drift left + slight zoom
  { scale: [1, 1.04], x: [0, -20], y: [0, 0], rotate: [0, 0] },
  // Drift up
  { scale: [1.03, 1.06], x: [0, 8], y: [0, -14], rotate: [0, 0] },
  // Drift down + gentle rotation
  { scale: [1.02, 1.05], x: [0, -8], y: [0, 12], rotate: [0, 0.4] },
  // Right + zoom with slight rotation
  { scale: [1, 1.05], x: [0, 16], y: [0, -8], rotate: [0, -0.3] },
  // Left + zoom with slight rotation
  { scale: [1, 1.05], x: [0, -16], y: [0, 8], rotate: [0, 0.3] },
];

function getAmbientPreset(slideIndex: number) {
  return AMBIENT_PRESETS[slideIndex % AMBIENT_PRESETS.length];
}

function getNextTransition(current: TransitionType): TransitionType {
  const available = TRANSITIONS.filter((t) => t !== current);
  return available[Math.floor(Math.random() * available.length)];
}

const SLIDE_DURATION_MS = 8000; // 8 seconds per slide

export function HeroSlideshow({ totalSlides }: HeroSlideshowProps) {
  // Build initial shuffled sequence
  const initialQueue = useMemo(
    () => shuffle(Array.from({ length: totalSlides }, (_, i) => i)),
    [totalSlides]
  );

  const [queue, setQueue] = useState<number[]>(initialQueue);
  const [queuePos, setQueuePos] = useState(0);       // position in current queue
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [transition, setTransition] = useState<TransitionType>("zoomPan");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /** The actual slide index (0-based) being displayed */
  const currentSlide = queue[queuePos];

  const advanceTo = useCallback(
    (direction: 1 | -1) => {
      setTransition((prev) => getNextTransition(prev));
      setQueuePos((prev) => {
        let next = prev + direction;
        if (next >= totalSlides) {
          // Full loop done — reshuffle ensuring first != last of previous queue
          setQueue((prevQueue) => {
            let newQueue = shuffle(Array.from({ length: totalSlides }, (_, i) => i));
            // Avoid showing same slide immediately
            while (newQueue[0] === prevQueue[prevQueue.length - 1]) {
              newQueue = shuffle(Array.from({ length: totalSlides }, (_, i) => i));
            }
            return newQueue;
          });
          next = 0;
        } else if (next < 0) {
          next = totalSlides - 1;
        }
        return next;
      });
    },
    [totalSlides]
  );

  // Auto-advance timer
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isPlaying && !isHovered) {
      timeoutRef.current = setTimeout(() => advanceTo(1), SLIDE_DURATION_MS);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, isPlaying, isHovered, advanceTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") advanceTo(-1);
      if (e.key === "ArrowRight") advanceTo(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advanceTo]);

  const padded = (n: number) => String(n + 1).padStart(2, "0");
  const ambient = getAmbientPreset(currentSlide);

  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#0a1a0f] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} mode="crossfade">
        <motion.div
          key={currentSlide}
          variants={transitionVariants[transition]}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        >
          {/* Ambient continuous motion wrapper */}
          <motion.div
            className="w-full h-full"
            initial={{ scale: ambient.scale[0], x: ambient.x[0], y: ambient.y[0], rotate: ambient.rotate[0] }}
            animate={{ scale: ambient.scale[1], x: ambient.x[1], y: ambient.y[1], rotate: ambient.rotate[1] }}
            transition={{ duration: SLIDE_DURATION_MS / 1000, ease: "linear" }}
            style={{ transformOrigin: "center center" }}
          >
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={`/images/hero-slides/hero-slide-${padded(currentSlide)}-mobile.webp`}
              />
              <source
                media="(max-width: 1280px)"
                srcSet={`/images/hero-slides/hero-slide-${padded(currentSlide)}-tablet.webp`}
              />
              <img
                src={`/images/hero-slides/hero-slide-${padded(currentSlide)}-desktop.webp`}
                alt={`Jemeka Tours travel destination ${padded(currentSlide)}`}
                className="w-full h-full object-cover"
                loading={queuePos < 2 ? "eager" : "lazy"}
                fetchPriority={queuePos === 0 ? "high" : "auto"}
              />
            </picture>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls — bottom right, above gradient */}
      <div
        className="absolute bottom-8 right-6 z-30 flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-3 py-2 border border-white/15"
        role="group"
        aria-label="Slideshow controls"
      >
        <button
          onClick={() => advanceTo(-1)}
          aria-label="Previous slide"
          className="text-white hover:text-[#F4A261] transition-colors p-1.5 rounded-full hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span
          className="text-white font-mono text-xs tabular-nums px-2 select-none min-w-[52px] text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {padded(currentSlide)}&thinsp;<span className="text-white/40">/</span>&thinsp;
          <span className="text-white/40">{String(totalSlides).padStart(2, "0")}</span>
        </span>

        <button
          onClick={() => advanceTo(1)}
          aria-label="Next slide"
          className="text-white hover:text-[#F4A261] transition-colors p-1.5 rounded-full hover:bg-white/10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-white/20 mx-1" />

        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          className="text-white hover:text-[#F4A261] transition-colors p-1.5 rounded-full hover:bg-white/10"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Progress bar — bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-30">
        <motion.div
          key={`${currentSlide}-${isPlaying}-${isHovered}`}
          className="h-full bg-[#F4A261]"
          initial={{ width: "0%" }}
          animate={{ width: isPlaying && !isHovered ? "100%" : "0%" }}
          transition={{ duration: SLIDE_DURATION_MS / 1000, ease: "linear" }}
        />
      </div>
    </div>
  );
}
