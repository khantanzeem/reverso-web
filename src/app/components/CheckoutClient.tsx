"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CheckCircle2, Wallet, CalendarClock, PartyPopper } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuthUser } from "./useAuthUser";
import CoursePrice from "./CoursePrice";
import { getBatchTemplates } from "@/lib/content";
import { pickBatch, batchDaysLabel, parseTimeLabel, FALLBACK_BATCHES, type Batch } from "@/lib/batch";
import type { Course } from "@/lib/types";

const INSTALLMENT_COUNT = 3;
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

type Plan = "full" | "installments";

export default function CheckoutClient({ course }: { course: Course }) {
  const { user, loading } = useAuthUser();
  const [plan, setPlan] = useState<Plan>("full");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState<Batch[]>(FALLBACK_BATCHES);
  const checkoutPath = `/courses/${course.slug}/checkout`;

  useEffect(() => {
    getBatchTemplates().then((templates) => {
      if (templates.length === 0) return;
      setBatches(
        templates.map((t) => ({
          name: t.name,
          days: t.days,
          time: t.time,
          joinLink: t.joinLink,
          ...parseTimeLabel(t.time),
        }))
      );
    });
  }, []);

  if (loading) {
    return <div className="container-x max-w-2xl py-16" />;
  }

  if (!user) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Log in to continue</h1>
        <p className="mt-2 text-sm text-ink/60">
          You need an account to enroll in {course.title}.
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
    const batch = pickBatch(`${user.uid}:${course.id}`, batches);
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-signal/10 text-signal-600">
          <PartyPopper size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-navy">You&apos;re enrolled!</h1>
        <p className="mt-2 text-sm text-ink/60">
          Payment integration is still a work in progress — for now, clicking &ldquo;Proceed to
          Payment&rdquo; enrolls you directly in <strong>{course.title}</strong> (
          {plan === "full" ? "full payment" : `${INSTALLMENT_COUNT} installments`}). You&apos;ve
          been placed in the <strong>{batch.name}</strong> ({batchDaysLabel(batch.days)},{" "}
          {batch.time}).
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/profile" className="btn btn-primary">
            Go to my dashboard
          </Link>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center justify-center rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-mist"
          >
            Back to course
          </Link>
        </div>
      </div>
    );
  }

  async function handleProceed() {
    setSubmitting(true);
    setError("");
    try {
      const batch = pickBatch(`${user!.uid}:${course.id}`, batches);
      await addDoc(collection(db, "enrollments"), {
        uid: user!.uid,
        email: user!.email,
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        courseImage: course.image || "",
        price: course.price,
        plan,
        installments: plan === "installments" ? INSTALLMENT_COUNT : 1,
        batchName: batch.name,
        batchDays: batch.days,
        batchTime: batch.time,
        joinLink: batch.joinLink,
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

  const installmentAmount = course.price / INSTALLMENT_COUNT;

  return (
    <div className="container-x max-w-2xl py-16">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Complete your enrollment</h1>
      <p className="mt-2 text-sm text-ink/60">
        Choose how you&apos;d like to pay for <strong>{course.title}</strong>.
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setPlan("full")}
          className={`rounded-2xl border-2 p-5 text-left transition-all ${
            plan === "full" ? "border-signal bg-signal/5" : "border-black/10 bg-white hover:border-black/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
              <Wallet size={18} />
            </span>
            {plan === "full" && <CheckCircle2 size={20} className="text-signal-600" />}
          </div>
          <p className="mt-3 font-semibold text-navy">Full Payment</p>
          <p className="mt-1 text-sm text-ink/60">Pay {inr(course.price)} now, one time.</p>
        </button>

        <button
          type="button"
          onClick={() => setPlan("installments")}
          className={`rounded-2xl border-2 p-5 text-left transition-all ${
            plan === "installments" ? "border-signal bg-signal/5" : "border-black/10 bg-white hover:border-black/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
              <CalendarClock size={18} />
            </span>
            {plan === "installments" && <CheckCircle2 size={20} className="text-signal-600" />}
          </div>
          <p className="mt-3 font-semibold text-navy">Installments</p>
          <p className="mt-1 text-sm text-ink/60">
            {INSTALLMENT_COUNT} x {inr(installmentAmount)} / month
          </p>
        </button>
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
        You won&apos;t be charged yet — this reserves your seat while we confirm payment details.
      </p>
    </div>
  );
}
