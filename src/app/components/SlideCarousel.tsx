"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SlideItem {
  id: string;
  content: React.ReactNode;
}

export default function SlideCarousel({
  items,
  autoplayMs = 5000,
}: {
  items: SlideItem[];
  autoplayMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [items.length, autoplayMs]);

  const go = (steps: number) => {
    setIndex((i) => (i + steps + items.length) % items.length);
  };

  const slide = items[index];
  if (!slide) return null;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {slide.content}
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute -left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white p-2 text-navy shadow-md transition-colors hover:bg-navy hover:text-white sm:-left-5 sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute -right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white p-2 text-navy shadow-md transition-colors hover:bg-navy hover:text-white sm:-right-5 sm:flex"
          >
            <ChevronRight size={18} />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            {items.map((it, i) => (
              <button
                key={it.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-signal" : "w-2 bg-black/15 hover:bg-black/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
