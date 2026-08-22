"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { Check, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import type { Course, CourseModule } from "@/lib/types";

type DraftModule = { title: string; duration: string; itemsText: string };

function toDraftModules(modules?: CourseModule[]): DraftModule[] {
  return (modules || []).map((m) => ({
    title: m.title,
    duration: m.duration || "",
    itemsText: (m.items || []).join("\n"),
  }));
}

export default function CourseForm({ course, id }: { course?: Course; id?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState(course?.title || "");
  const [slug, setSlug] = useState(course?.slug || "");
  const [categoryId, setCategoryId] = useState(course?.categoryId || "");
  const [summary, setSummary] = useState(course?.summary || "");
  const [description, setDescription] = useState(course?.description || "");
  const [price, setPrice] = useState(course?.price ?? 0);
  const [mrp, setMrp] = useState(course?.mrp ?? 0);
  const [duration, setDuration] = useState(course?.duration || "");
  const [prerequisites, setPrerequisites] = useState(course?.prerequisites || "");
  const [image, setImage] = useState(course?.image || "");
  const [published, setPublished] = useState(course?.published ?? false);
  const [order, setOrder] = useState(course?.order ?? 1);
  const [modules, setModules] = useState<DraftModule[]>(toDraftModules(course?.curriculum));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addModule() {
    setModules((m) => [...m, { title: "", duration: "", itemsText: "" }]);
  }

  function updateModule(i: number, patch: Partial<DraftModule>) {
    setModules((m) => m.map((mod, idx) => (idx === i ? { ...mod, ...patch } : mod)));
  }

  function removeModule(i: number) {
    setModules((m) => m.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const curriculum: CourseModule[] = modules
        .filter((m) => m.title.trim())
        .map((m) => ({
          title: m.title.trim(),
          duration: m.duration.trim(),
          items: m.itemsText
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        }));

      const payload = {
        title,
        slug,
        categoryId,
        summary,
        description,
        price: Number(price) || 0,
        mrp: Number(mrp) || 0,
        duration,
        prerequisites,
        image,
        published,
        order: Number(order) || 1,
        curriculum,
      };

      if (id) {
        await setDoc(doc(db, "courses", id), payload, { merge: true });
      } else {
        await addDoc(collection(db, "courses"), payload);
      }
      router.push("/admin/courses");
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
          <label className="grid gap-1.5 text-sm font-medium text-navy">
            Category ID
            <input value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-navy">
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
        <h3 className="font-semibold text-navy">Pricing & details</h3>
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
            Duration
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30 days"
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
          <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2 lg:col-span-2">
            Prerequisites
            <input
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
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

      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-navy">Syllabus / Curriculum</h3>
          <button
            onClick={addModule}
            className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-mist"
          >
            <Plus size={14} /> Add module
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {modules.length === 0 && <p className="text-sm text-ink/50">No modules yet.</p>}
          {modules.map((m, i) => (
            <div key={i} className="rounded-xl border border-black/10 bg-mist/40 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/10 text-xs font-bold text-signal-600">
                  {i + 1}
                </span>
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-medium text-navy">
                    Module title
                    <input
                      value={m.title}
                      onChange={(e) => updateModule(i, { title: e.target.value })}
                      className="input"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-navy">
                    Duration (optional)
                    <input
                      value={m.duration}
                      onChange={(e) => updateModule(i, { duration: e.target.value })}
                      placeholder="5 days"
                      className="input"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2">
                    Topics (one per line)
                    <textarea
                      value={m.itemsText}
                      onChange={(e) => updateModule(i, { itemsText: e.target.value })}
                      rows={4}
                      className="input resize-none"
                    />
                  </label>
                </div>
                <button
                  onClick={() => removeModule(i)}
                  className="mt-2 shrink-0 text-red-500 hover:text-red-700"
                  aria-label="Remove module"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
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
