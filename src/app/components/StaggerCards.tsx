"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

export interface StaggerCardItem {
  id: string;
  /** Pre-rendered card content. Use the `group-data-[center=true]:` variant
   * to style differently when this card is the active/center one. */
  content: React.ReactNode;
}

type Entry = { renderKey: string; item: StaggerCardItem };

interface StaggerCardsProps {
  items: StaggerCardItem[];
  height?: number;
}

export default function StaggerCards({ items, height = 560 }: StaggerCardsProps) {
  const [cardSize, setCardSize] = useState(340);
  const [list, setList] = useState<Entry[]>(() =>
    items.map((item) => ({ renderKey: item.id, item }))
  );

  useEffect(() => {
    setList(items.map((item) => ({ renderKey: item.id, item })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.id).join(",")]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 340 : 280);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMove = (steps: number) => {
    if (steps === 0) return;
    setList((prev) => {
      const next = [...prev];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const entry = next.shift();
          if (!entry) return prev;
          next.push({ ...entry, renderKey: `${entry.item.id}-${Math.random()}` });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const entry = next.pop();
          if (!entry) return prev;
          next.unshift({ ...entry, renderKey: `${entry.item.id}-${Math.random()}` });
        }
      }
      return next;
    });
  };

  const center = Math.floor(list.length / 2);

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {list.map((entry, index) => {
        const position = index - center;
        const isCenter = position === 0;
        return (
          <div
            key={entry.renderKey}
            data-center={isCenter}
            onClick={() => handleMove(position)}
            className={cn(
              "group absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 transition-all duration-500 ease-in-out sm:p-8",
              isCenter
                ? "z-10 border-navy bg-navy"
                : "z-0 border-black/10 bg-white hover:border-signal/50"
            )}
            style={{
              width: cardSize,
              height: cardSize,
              clipPath:
                "polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)",
              transform: `
                translate(-50%, -50%)
                translateX(${(cardSize / 1.5) * position}px)
                translateY(${isCenter ? -40 : position % 2 ? 15 : -15}px)
                rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
              `,
              boxShadow: isCenter ? "0px 8px 0px 4px rgba(11,31,58,0.12)" : "none",
            }}
          >
            <span
              className="absolute block origin-top-right rotate-45 bg-black/10"
              style={{ right: -2, top: 38, width: SQRT_5000, height: 2 }}
            />
            {entry.item.content}
          </div>
        );
      })}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className="flex h-12 w-12 items-center justify-center border-2 border-black/10 bg-white text-ink transition-colors hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => handleMove(1)}
          className="flex h-12 w-12 items-center justify-center border-2 border-black/10 bg-white text-ink transition-colors hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
