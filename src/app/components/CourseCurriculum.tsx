"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import type { CourseModule } from "@/lib/types";

export default function CourseCurriculum({ modules }: { modules: CourseModule[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      {modules.map((m, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={m.title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-mist"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal/10 text-xs font-bold text-signal-600">
                  {i + 1}
                </span>
                <span className="font-semibold text-navy">{m.title}</span>
                {m.duration && (
                  <span className="hidden text-xs text-ink/50 sm:inline">· {m.duration}</span>
                )}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-ink/40 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2 px-6 pb-5 pl-[3.25rem]">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-signal-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
