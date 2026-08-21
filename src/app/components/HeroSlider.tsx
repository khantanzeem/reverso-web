"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, ShieldCheck } from "lucide-react";
import type { Banner } from "@/lib/types";

const AUTOPLAY_MS = 6000;

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const slide = banners[index];

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [banners.length]);

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
              <Link href="/demo" className="btn btn-ghost">
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
        {slide.image && (
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Glow + decorative ring behind the frame */}
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-signal/40 via-signal-600/20 to-transparent blur-3xl" />
              <div className="absolute -right-5 -top-5 h-24 w-24 rounded-2xl border-2 border-dashed border-signal/40" />
              <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-signal-600/20 blur-xl" />

              {/* Framed image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-navy/40 ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image} alt="" className="h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
              </div>

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-xl shadow-navy/20"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal-600">
                  <GraduationCap size={20} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-navy">500+</p>
                  <p className="text-xs text-ink/60">Students placed</p>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -top-5 right-6 flex items-center gap-2 rounded-full bg-navy/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur"
              >
                <ShieldCheck size={14} className="text-signal" />
                100% Placement Assistance
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
