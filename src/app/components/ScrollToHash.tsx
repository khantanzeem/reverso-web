"use client";

import { useEffect } from "react";

/**
 * Next.js's client-side <Link> navigation doesn't reliably scroll to a
 * URL hash on arrival (a long-standing App Router limitation). This
 * mounts on the target page and does it manually.
 */
export default function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}
