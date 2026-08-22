"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import type { Course } from "@/lib/types";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    getDocs(collection(db, "courses")).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course);
      list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setCourses(list);
    });
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await deleteDoc(doc(db, "courses", id));
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Courses</h2>
          <p className="mt-1 text-sm text-ink/60">Manage pricing, syllabus, and publish status.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy/90"
        >
          <Plus size={14} /> Add course
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {courses === null && <p className="text-sm text-ink/50">Loading…</p>}
        {courses?.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{c.title}</p>
                <p className="text-sm text-ink/60">
                  ₹{c.price?.toLocaleString("en-IN")}
                  {c.mrp && c.mrp > c.price ? ` (MRP ₹${c.mrp.toLocaleString("en-IN")})` : ""} ·{" "}
                  {c.published ? "Published" : "Draft"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/admin/courses/${c.id}`}
                className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-navy hover:bg-mist"
              >
                <Pencil size={12} /> Edit
              </Link>
              <button
                onClick={() => handleDelete(c.id, c.title)}
                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
