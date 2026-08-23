"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { Check } from "lucide-react";
import { db } from "@/lib/firebase";
import type { VideoCourse } from "@/lib/types";

export default function VideoCourseForm({ course, id }: { course?: VideoCourse; id?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(course?.title || "");
  const [slug, setSlug] = useState(course?.slug || "");
  const [summary, setSummary] = useState(course?.summary || "");
  const [description, setDescription] = useState(course?.description || "");
  const [price, setPrice] = useState(course?.price ?? 0);
  const [mrp, setMrp] = useState(course?.mrp ?? 0);
  const [image, setImage] = useState(course?.image || "");
  const [published, setPublished] = useState(course?.published ?? false);
  const [order, setOrder] = useState(course?.order ?? 1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        title,
        slug,
        summary,
        description,
        price: Number(price) || 0,
        mrp: Number(mrp) || 0,
        image,
        published,
        order: Number(order) || 1,
      };
      if (id) {
        await setDoc(doc(db, "videoCourses", id), payload, { merge: true });
      } else {
        await addDoc(collection(db, "videoCourses"), payload);
      }
      router.push("/admin/video-courses");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Couldn't save the course.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-navy">Basics</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-navy">
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-navy">
            Slug
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="input" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2">
            Image URL
            <input value={image} onChange={(e) => setImage(e.target.value)} className="input" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2">
            Summary
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2">
            Description (HTML)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="input resize-none font-mono text-xs"
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-navy">Pricing</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1.5 text-sm font-medium text-navy">
            Price (₹)
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="input"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-navy">
            MRP (₹, optional)
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(Number(e.target.value))}
              className="input"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-navy">
            Order
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="input"
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-navy">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-black/20 accent-signal"
            />
            Published
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !title || !slug}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
        >
          <Check size={15} /> {saving ? "Saving…" : "Save course"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
