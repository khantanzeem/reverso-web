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

export type FieldType = "text" | "textarea" | "number" | "boolean" | "url";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

type DocRecord = Record<string, unknown> & { id: string };

export default function CollectionManager({
  collectionName,
  fields,
  titleKey,
  subtitleKey,
  defaults,
}: {
  collectionName: string;
  fields: FieldDef[];
  /** Field to show as the card's main label in view mode. */
  titleKey: string;
  /** Optional secondary field shown under the title. */
  subtitleKey?: string;
  /** Defaults applied to a newly created document. */
  defaults?: Record<string, unknown>;
}) {
  const [items, setItems] = useState<DocRecord[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    getDocs(collection(db, collectionName)).then((snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DocRecord);
      list.sort((a, b) => {
        const oa = typeof a.order === "number" ? a.order : 999;
        const ob = typeof b.order === "number" ? b.order : 999;
        return oa - ob;
      });
      setItems(list);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This can't be undone.")) return;
    await deleteDoc(doc(db, collectionName, id));
    load();
  }

  const blankValues: Record<string, unknown> = { order: (items?.length || 0) + 1, ...defaults };
  for (const f of fields) {
    if (!(f.key in blankValues)) blankValues[f.key] = f.type === "boolean" ? true : f.type === "number" ? 0 : "";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">{items?.length ?? "…"} items</p>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy/90"
        >
          <Plus size={14} /> Add new
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {creating && (
          <EditCard
            fields={fields}
            initial={blankValues}
            onCancel={() => setCreating(false)}
            onSave={async (values) => {
              await addDoc(collection(db, collectionName), values);
              setCreating(false);
              load();
            }}
          />
        )}

        {items === null && <p className="text-sm text-ink/50">Loading…</p>}
        {items?.length === 0 && !creating && (
          <p className="rounded-xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-ink/50">
            Nothing here yet.
          </p>
        )}

        {items?.map((item) =>
          editingId === item.id ? (
            <EditCard
              key={item.id}
              fields={fields}
              initial={item}
              onCancel={() => setEditingId(null)}
              onSave={async (values) => {
                await updateDoc(doc(db, collectionName, item.id), values);
                setEditingId(null);
                load();
              }}
            />
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy">{String(item[titleKey] ?? "Untitled")}</p>
                {subtitleKey && item[subtitleKey] != null && (
                  <p className="truncate text-sm text-ink/60">{String(item[subtitleKey])}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setEditingId(item.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-navy hover:bg-mist"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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

function EditCard({
  fields,
  initial,
  onSave,
  onCancel,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  onSave: (values: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [saving, setSaving] = useState(false);

  function set(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const normalized = { ...values };
    for (const f of fields) {
      if (f.type === "number") normalized[f.key] = Number(normalized[f.key]) || 0;
    }
    await onSave(normalized);
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-signal/30 bg-signal/5 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.key}
            className={`grid gap-1.5 text-sm font-medium text-navy ${
              f.type === "textarea" ? "sm:col-span-2" : ""
            }`}
          >
            {f.label}
            {f.type === "textarea" ? (
              <textarea
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={4}
                className="input resize-none"
              />
            ) : f.type === "boolean" ? (
              <select
                value={values[f.key] ? "true" : "false"}
                onChange={(e) => set(f.key, e.target.value === "true")}
                className="input"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : (
              <input
                type={f.type === "number" ? "number" : "text"}
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="input"
              />
            )}
          </label>
        ))}
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
