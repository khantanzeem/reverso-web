"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { Check, Clock, Mail, Phone } from "lucide-react";
import { db } from "@/lib/firebase";
import type { FormSubmission } from "@/lib/types";

function formatDate(ts: unknown): string {
  const d = (ts as { toDate?: () => Date })?.toDate?.();
  if (!d) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<FormSubmission[] | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "handled">("pending");

  useEffect(() => {
    load();
  }, []);

  function load() {
    getDocs(collection(db, "formSubmissions")).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FormSubmission);
      list.sort((a, b) => {
        const da = (a.createdAt as { toMillis?: () => number })?.toMillis?.() || 0;
        const db_ = (b.createdAt as { toMillis?: () => number })?.toMillis?.() || 0;
        return db_ - da;
      });
      setItems(list);
    });
  }

  async function toggleHandled(item: FormSubmission) {
    await updateDoc(doc(db, "formSubmissions", item.id), { handled: !item.handled });
    load();
  }

  const filtered = (items || []).filter((i) =>
    filter === "all" ? true : filter === "pending" ? !i.handled : i.handled
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Inquiries</h2>
      <p className="mt-1 text-sm text-ink/60">Contact form and free-demo requests.</p>

      <div className="mt-4 flex gap-2">
        {(["pending", "handled", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f ? "bg-navy text-white" : "bg-white text-ink/60 hover:bg-mist"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {items === null && <p className="text-sm text-ink/50">Loading…</p>}
        {items !== null && filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-ink/50">
            Nothing here.
          </p>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    item.type === "free-demo"
                      ? "bg-signal/10 text-signal-600"
                      : "bg-navy/10 text-navy"
                  }`}
                >
                  {item.type === "free-demo" ? "Free demo" : "Contact"}
                </span>
                <p className="font-semibold text-navy">{item.name}</p>
                {item.course && <span className="text-xs text-ink/50">· {item.course}</span>}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {item.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {item.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {formatDate(item.createdAt)}
                </span>
              </div>
              {item.message && <p className="mt-2 text-sm text-ink/70">{item.message}</p>}
            </div>
            <button
              onClick={() => toggleHandled(item)}
              className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                item.handled
                  ? "border-black/10 text-ink/60 hover:bg-mist"
                  : "border-signal bg-signal/10 text-signal-600 hover:bg-signal/20"
              }`}
            >
              <Check size={13} /> {item.handled ? "Mark pending" : "Mark handled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
