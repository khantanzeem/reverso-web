"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { batchDaysLabel } from "@/lib/batch";
import type { BatchTemplate } from "@/lib/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<BatchTemplate[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    getDocs(collection(db, "batchTemplates")).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BatchTemplate);
      list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setBatches(list);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this batch template? Students already assigned to it keep their schedule.")) return;
    await deleteDoc(doc(db, "batchTemplates", id));
    load();
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Batch Schedules</h2>
      <p className="mt-1 text-sm text-ink/60">
        These templates are what new enrollments get auto-assigned to. Editing a template only
        affects future enrollments — to change an already-enrolled student&apos;s schedule, use{" "}
        <a href="/admin/enrollments" className="font-semibold text-signal-600">
          Enrollments
        </a>
        .
      </p>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy/90"
        >
          <Plus size={14} /> Add batch
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {creating && (
          <BatchForm
            initial={{ id: "", name: "", days: [], time: "", joinLink: "", order: (batches?.length || 0) + 1 }}
            onCancel={() => setCreating(false)}
            onSave={async (values) => {
              await addDoc(collection(db, "batchTemplates"), values);
              setCreating(false);
              load();
            }}
          />
        )}

        {batches === null && <p className="text-sm text-ink/50">Loading…</p>}
        {batches?.length === 0 && !creating && (
          <p className="rounded-xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-ink/50">
            No batch templates yet — add one so checkout has a schedule to assign.
          </p>
        )}

        {batches?.map((b) =>
          editingId === b.id ? (
            <BatchForm
              key={b.id}
              initial={b}
              onCancel={() => setEditingId(null)}
              onSave={async (values) => {
                await updateDoc(doc(db, "batchTemplates", b.id), values);
                setEditingId(null);
                load();
              }}
            />
          ) : (
            <div
              key={b.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-navy">{b.name}</p>
                <p className="text-sm text-ink/60">
                  {batchDaysLabel(b.days)} · {b.time}
                </p>
                <p className="text-xs text-ink/40">{b.joinLink}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditingId(b.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-navy hover:bg-mist"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function BatchForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<BatchTemplate, "id"> & { id: string };
  onSave: (values: Omit<BatchTemplate, "id">) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [time, setTime] = useState(initial.time);
  const [joinLink, setJoinLink] = useState(initial.joinLink);
  const [order, setOrder] = useState(initial.order || 1);
  const [days, setDays] = useState<number[]>(initial.days || []);
  const [saving, setSaving] = useState(false);

  function toggleDay(d: number) {
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort()));
  }

  async function save() {
    setSaving(true);
    await onSave({ name, time, joinLink, order, days });
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-signal/30 bg-signal/5 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-navy">
          Batch name
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-navy">
          Timing
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="7:00 PM – 8:30 PM IST"
            className="input"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2">
          Join link
          <input
            value={joinLink}
            onChange={(e) => setJoinLink(e.target.value)}
            placeholder="https://meet.google.com/..."
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
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-navy">Class days</p>
          <div className="flex flex-wrap gap-2">
            {DAY_LABELS.map((label, i) => (
              <button
                type="button"
                key={label}
                onClick={() => toggleDay(i)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  days.includes(i)
                    ? "border-signal bg-signal text-navy"
                    : "border-black/10 bg-white text-ink/60 hover:border-black/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
        >
          <Check size={15} /> {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-white"
        >
          <X size={15} /> Cancel
        </button>
      </div>
    </div>
  );
}
