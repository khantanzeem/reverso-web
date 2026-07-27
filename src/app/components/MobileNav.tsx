"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthUser } from "./useAuthUser";

type NavItem = { label: string; href: string };

export default function MobileNav({ nav }: { nav: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthUser();

  return (
    <div className="md:hidden">
      <button
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md"
      >
        <motion.span
          className="h-0.5 w-6 rounded-full bg-navy"
          animate={open ? { y: 8, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.25 }}
        />
        <motion.span
          className="h-0.5 w-6 rounded-full bg-navy"
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="h-0.5 w-6 rounded-full bg-navy"
          animate={open ? { y: -8, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.25 }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[var(--header-h,96px)] z-30 border-b border-black/5 bg-white shadow-lg"
          >
            <nav className="container-x flex flex-col gap-1 py-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mist hover:text-signal-600"
              >
                Home
              </Link>
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mist hover:text-signal-600"
                >
                  {n.label}
                </Link>
              ))}
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mist hover:text-signal-600"
                >
                  Profile
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-mist hover:text-signal-600"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary mt-2"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
