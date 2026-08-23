"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Check, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";

interface LessonDraft {
  id: string;
  title: string;
  videoId: string;
  duration: string;
  isPreview: boolean;
  order: number;
}

/** Accepts a bare YouTube ID or a full youtube.com/youtu.be URL and returns just the ID. */
function extractVideoId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{6,})/
  );
  return match ? match[1] : trimmed;
}

function newLesson(order: number): LessonDraft {
  return {
    id: crypto.randomUUID(),
    title: "",
    videoId: "",
    duration: "",
    isPreview: false,
    order,
  };
}

export default function LessonsEditor({
  entityId,
  titleCollection,
  backHref,
  backLabel,
}: {
  /** Doc id in `courseVideos`, shared key with the parent course/videoCourse doc. */
  entityId: string;
  /** Collection to read the parent's title from, for display only. */
  titleCollection: "courses" | "videoCourses";
  backHref: string;
  backLabel: string;
}) {
  const [lessons, setLessons] = useState<LessonDraft[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getDoc(doc(db, titleCollection, entityId)).then((snap) => {
      setTitle((snap.data()?.title as string) || entityId);
    });
    getDoc(doc(db, "courseVideos", entityId)).then((snap) => {
      const data = (snap.data()?.lessons as LessonDraft[]) || [];
      setLessons(data.sort((a, b) => a.order - b.order));
    });
  }, [entityId, titleCollection]);

  function update(id: string, patch: Partial<LessonDraft>) {
    setLessons((cur) => cur!.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    setSaved(false);
  }

  function addLesson() {
    setLessons((cur) => [...(cur || []), newLesson((cur?.length || 0) + 1)]);
    setSaved(false);
  }

  function removeLesson(id: string) {
    if (!confirm("Remove this lesson? Students lose access to its video.")) return;
    setLessons((cur) => cur!.filter((l) => l.id !== id));
    setSaved(false);
  }

  async function save() {
    if (!lessons) return;
    setSaving(true);
    const normalized = lessons.map((l, i) => ({
      ...l,
      videoId: extractVideoId(l.videoId),
      order: i + 1,
    }));
    await setDoc(doc(db, "courseVideos", entityId), { lessons: normalized }, { merge: true });
    setLessons(normalized);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <Link href={backHref} className="text-sm font-semibold text-ink/60 hover:text-signal-600">
        ← {backLabel}
      </Link>
      <h2 className="mt-2 text-xl font-bold text-navy">Videos — {title}</h2>
      <p className="mt-1 text-sm text-ink/60">
        Paste a YouTube video ID or full URL per lesson. Lessons not marked as a free preview are
        only ever served to students with an active enrollment — the video ID is never sent to
        the browser until that check passes server-side.
      </p>

      <div className="mt-6 flex justify-end">
        <button
          onClick={addLesson}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy/90"
        >
          <Plus size={14} /> Add lesson
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {lessons === null && <p className="text-sm text-ink/50">Loading…</p>}
        {lessons?.length === 0 && (
          <p className="rounded-xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-ink/50">
            No video lessons yet.
          </p>
        )}
        {lessons?.map((l, i) => (
          <div key={l.id} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-2.5 flex shrink-0 items-center gap-1 text-ink/30">
                <GripVertical size={16} />
                {i + 1}
              </span>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2">
                  Lesson title
                  <input
                    value={l.title}
                    onChange={(e) => update(l.id, { title: e.target.value })}
                    className="input"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-navy sm:col-span-2">
                  YouTube video ID or URL
                  <input
                    value={l.videoId}
                    onChange={(e) => update(l.id, { videoId: e.target.value })}
                    placeholder="https://youtu.be/XXXXXXXXXXX or just the ID"
                    className="input font-mono text-xs"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-navy">
                  Duration (optional)
                  <input
                    value={l.duration}
                    onChange={(e) => update(l.id, { duration: e.target.value })}
                    placeholder="12:34"
                    className="input"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => update(l.id, { isPreview: !l.isPreview })}
                  className={`mt-6 inline-flex h-fit items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                    l.isPreview
                      ? "border-signal bg-signal/10 text-signal-600"
                      : "border-black/10 text-ink/60 hover:bg-mist"
                  }`}
                >
                  {l.isPreview ? <Eye size={13} /> : <EyeOff size={13} />}
                  {l.isPreview ? "Free preview" : "Locked (paid only)"}
                </button>
              </div>
              <button
                onClick={() => removeLesson(l.id)}
                className="mt-2 shrink-0 text-red-500 hover:text-red-700"
                aria-label="Remove lesson"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {lessons && lessons.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
          >
            <Check size={15} /> {saving ? "Saving…" : "Save videos"}
          </button>
          {saved && <span className="text-sm text-signal-600">Saved.</span>}
        </div>
      )}
    </div>
  );
}
