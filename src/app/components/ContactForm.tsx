"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Course } from "@/lib/types";

type FormType = "contact" | "free-demo";

export default function ContactForm({
  type = "contact",
  courses = [],
  defaultCourseSlug,
}: {
  type?: FormType;
  /** Course list to populate the "Which course?" dropdown on the free-demo form. */
  courses?: Pick<Course, "id" | "slug" | "title">[];
  /** Pre-select a course, e.g. when arriving from a course's "Enquire / Enroll" link. */
  defaultCourseSlug?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const f = new FormData(e.currentTarget);

    // Honeypot: real users leave this empty; bots fill it.
    if (f.get("company")) {
      setStatus("done");
      return;
    }

    const courseSlug = String(f.get("course") || "");
    const course = courses.find((c) => c.slug === courseSlug);

    const payload = {
      type,
      name: String(f.get("name") || ""),
      email: String(f.get("email") || ""),
      phone: String(f.get("phone") || ""),
      course: course?.title || courseSlug,
      message: String(f.get("message") || ""),
      handled: false,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "formSubmissions"), payload);
      // Best-effort email notification (optional; safe to fail).
      fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-signal/30 bg-signal/5 p-6">
        <p className="font-semibold text-navy">Thanks — we got your details.</p>
        <p className="mt-1 text-sm text-ink/70">
          Our team will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className="input" />
        <input name="phone" required placeholder="Phone" className="input" />
      </div>
      <input name="email" type="email" required placeholder="Email" className="input" />
      {type === "free-demo" && (
        <label className="grid gap-1.5 text-sm font-medium text-navy">
          Which course?
          <select
            name="course"
            required
            defaultValue={defaultCourseSlug || ""}
            className="input"
          >
            <option value="" disabled>
              Select a course
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.title}
              </option>
            ))}
            <option value="not-sure">Not sure yet / general enquiry</option>
          </select>
        </label>
      )}
      <textarea name="message" rows={4} placeholder="Message" className="input resize-none" />
      <button type="submit" disabled={status === "sending"} className="btn btn-primary w-fit disabled:opacity-60">
        {status === "sending" ? "Sending…" : type === "free-demo" ? "Request free demo" : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again or call us directly.
        </p>
      )}
    </form>
  );
}
