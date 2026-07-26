"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Banner } from "@/lib/types";
import WaterRippleImage from "./WaterRippleImage";

const AUTOPLAY_MS = 6000;

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const slide = banners[index];

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [banners.length]);

  // The image column is hidden below `lg`; avoid mounting the WebGL ripple
  // canvas (and its continuous render loop) when it isn't even visible.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setShowImage(mq.matches);
    const onChange = () => setShowImage(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!slide) return null;

  return (
    <div className="container-x relative grid items-center gap-8 py-20 lg:grid-cols-2">
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-signal">
              Training · Placement · Web Solutions
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              {slide.heading}
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              World-class telecom and IT training with real placement support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={slide.ctaLink || "/courses"} className="btn btn-primary">
                {slide.ctaText || "Explore courses"}
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Book a free demo
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {banners.length > 1 && (
          <div className="mt-10 flex items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-signal" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative hidden lg:block">
        {showImage && slide.image && (
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-signal/30 to-transparent blur-2xl" />
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl">
                <WaterRippleImage src={slide.image} />
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
