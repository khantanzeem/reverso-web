"use client";

import { useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { PartyPopper, PlayCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuthUser } from "./useAuthUser";
import CoursePrice from "./CoursePrice";
import type { VideoCourse } from "@/lib/types";

export default function VideoCheckoutClient({ course }: { course: VideoCourse }) {
  const { user, loading } = useAuthUser();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const checkoutPath = `/downloadable-courses/${course.slug}/checkout`;

  if (loading) {
    return <div className="container-x max-w-2xl py-16" />;
  }

  if (!user) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Log in to continue</h1>
        <p className="mt-2 text-sm text-ink/60">
          You need an account to buy {course.title}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/login?redirect=${encodeURIComponent(checkoutPath)}`}
            className="btn btn-primary"
          >
            Log in
          </Link>
          <Link
            href={`/signup?redirect=${encodeURIComponent(checkoutPath)}`}
            className="inline-flex items-center justify-center rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-mist"
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-signal/10 text-signal-600">
          <PartyPopper size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-navy">You&apos;re in!</h1>
        <p className="mt-2 text-sm text-ink/60">
          Payment integration is still a work in progress — for now, clicking &ldquo;Proceed to
          Payment&rdquo; unlocks the full video playlist for <strong>{course.title}</strong>{" "}
          immediately.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/downloadable-courses/${course.slug}/watch`} className="btn btn-primary inline-flex items-center gap-2">
            <PlayCircle size={16} /> Start watching
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-mist"
          >
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  async function handleProceed() {
    setSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "enrollments"), {
        uid: user!.uid,
        email: user!.email,
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        courseImage: course.image || "",
        price: course.price,
        plan: "full",
        installments: 1,
        type: "video",
        status: "enrolled",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-x max-w-2xl py-16">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Complete your purchase</h1>
      <p className="mt-2 text-sm text-ink/60">
        Unlock the full video playlist for <strong>{course.title}</strong>.
      </p>

      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        {course.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <p className="font-semibold text-navy">{course.title}</p>
          <CoursePrice price={course.price} mrp={course.mrp} size="sm" />
        </div>
      </div>

      <button
        onClick={handleProceed}
        disabled={submitting}
        className="btn btn-primary mt-8 w-full disabled:opacity-60"
      >
        {submitting ? "Processing…" : "Proceed to Payment"}
      </button>
      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-center text-xs text-ink/50">
        You won&apos;t be charged yet — this reserves access while we confirm payment details.
      </p>
    </div>
  );
}
