"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { Pencil, Check, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { getBatchTemplates } from "@/lib/content";
import { batchDaysLabel } from "@/lib/batch";
import type { Enrollment, BatchTemplate } from "@/lib/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [batchTemplates, setBatchTemplates] = useState<BatchTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    load();
    getBatchTemplates().then(setBatchTemplates);
  }, []);

  function load() {
    getDocs(collection(db, "enrollments")).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Enrollment);
      list.sort((a, b) => (a.courseTitle || "").localeCompare(b.courseTitle || ""));
      setEnrollments(list);
    });
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Enrollments</h2>
      <p className="mt-1 text-sm text-ink/60">
        Everyone currently enrolled, with their batch, schedule, and join link.
      </p>

      <div className="mt-6 space-y-4">
        {enrollments === null && <p className="text-sm text-ink/50">Loading…</p>}
        {enrollments?.length === 0 && (
          <p className="rounded-xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-ink/50">
            No enrollments yet.
          </p>
        )}
        {enrollments?.map((e) =>
          editingId === e.id ? (
            <EditRow
              key={e.id}
              enrollment={e}
              batchTemplates={batchTemplates}
              onCancel={() => setEditingId(null)}
              onSaved={() => {
                setEditingId(null);
                load();
              }}
            />
          ) : (
            <ViewRow key={e.id} enrollment={e} onEdit={() => setEditingId(e.id)} />
          )
        )}
      </div>
    </div>
  );
}

function ViewRow({ enrollment, onEdit }: { enrollment: Enrollment; onEdit: () => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold text-navy">{enrollment.courseTitle}</p>
        <p className="text-sm text-ink/60">
          {enrollment.email} · {enrollment.plan === "full" ? "Full payment" : `${enrollment.installments} installments`} ·{" "}
          ₹{enrollment.price?.toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-ink/50">
          {enrollment.batchName} — {(enrollment.batchDays || []).map((d) => DAY_LABELS[d]).join(", ")},{" "}
          {enrollment.batchTime}
        </p>
      </div>
      <button
        onClick={onEdit}
        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-black/10 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-mist sm:self-auto"
      >
        <Pencil size={13} /> Edit batch
      </button>
    </div>
  );
}

function EditRow({
  enrollment,
  batchTemplates,
  onCancel,
  onSaved,
}: {
  enrollment: Enrollment;
  batchTemplates: BatchTemplate[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [batchName, setBatchName] = useState(enrollment.batchName);
  const [batchTime, setBatchTime] = useState(enrollment.batchTime);
  const [joinLink, setJoinLink] = useState(enrollment.joinLink);
  const [days, setDays] = useState<number[]>(enrollment.batchDays || []);
  const [saving, setSaving] = useState(false);

  function toggleDay(d: number) {
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort()));
  }

  function applyTemplate(templateId: string) {
    const t = batchTemplates.find((b) => b.id === templateId);
    if (!t) return;
    setBatchName(t.name);
    setBatchTime(t.time);
    setJoinLink(t.joinLink);
    setDays(t.days);
  }

  async function save() {
    setSaving(true);
    await updateDoc(doc(db, "enrollments", enrollment.id), {
      batchName,
      batchTime,
      joinLink,
      batchDays: days,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="rounded-2xl border border-signal/30 bg-signal/5 p-5 shadow-sm">
      <p className="font-semibold text-navy">{enrollment.courseTitle}</p>
      <p className="text-sm text-ink/60">{enrollment.email}</p>

      {batchTemplates.length > 0 && (
        <label className="mt-4 grid gap-1.5 text-sm font-medium text-navy">
          Move to an existing batch
          <select
            defaultValue=""
            onChange={(e) => e.target.value && applyTemplate(e.target.value)}
            className="input"
          >
            <option value="" disabled>
              Select a batch…
            </option>
            {batchTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {batchDaysLabel(t.days)}, {t.time}
              </option>
            ))}
          </select>
        </label>
      )}

      <p className="mt-5 mb-1 text-xs font-semibold uppercase tracking-wide text-ink/40">
        Or set a custom schedule for just this student
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-navy">
          Batch name
          <input
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="input"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-navy">
          Timing
          <input
            value={batchTime}
            onChange={(e) => setBatchTime(e.target.value)}
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
          className="inline-flex items-center gap-1.5 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy/90 disabled:opacity-60"
        >
          <Check size={15} /> {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white"
        >
          <X size={15} /> Cancel
        </button>
      </div>
    </div>
  );
}
