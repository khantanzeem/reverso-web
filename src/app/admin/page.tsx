"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { GraduationCap, IndianRupee, MessageSquare, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import type { Enrollment, FormSubmission } from "@/lib/types";

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [inquiries, setInquiries] = useState<FormSubmission[] | null>(null);

  useEffect(() => {
    getDocs(collection(db, "enrollments")).then((snap) => {
      setEnrollments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Enrollment));
    });
    getDocs(collection(db, "formSubmissions")).then((snap) => {
      setInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FormSubmission));
    });
  }, []);

  const loading = enrollments === null || inquiries === null;
  const totalRevenue = (enrollments || []).reduce((sum, e) => sum + (e.price || 0), 0);
  const uniqueStudents = new Set((enrollments || []).map((e) => e.uid)).size;
  const pendingInquiries = (inquiries || []).filter((i) => !i.handled).length;

  const stats = [
    { label: "Total Enrollments", value: enrollments?.length ?? "—", icon: GraduationCap },
    { label: "Unique Students", value: uniqueStudents || "—", icon: Users },
    {
      label: "Revenue (recognized)",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
    { label: "Pending Inquiries", value: pendingInquiries, icon: MessageSquare },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Overview</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
              <s.icon size={18} />
            </span>
            <p className="mt-3 text-2xl font-bold text-navy">{loading ? "…" : s.value}</p>
            <p className="text-xs text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/enrollments"
          className="card-hover rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <h3 className="font-semibold text-navy">Manage enrollments</h3>
          <p className="mt-1 text-sm text-ink/60">
            See who bought which course, their plan, and adjust batch schedules & join links.
          </p>
        </Link>
        <Link
          href="/admin/inquiries"
          className="card-hover rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        >
          <h3 className="font-semibold text-navy">Contact & demo requests</h3>
          <p className="mt-1 text-sm text-ink/60">
            Review submissions from the contact form and free-demo requests.
          </p>
        </Link>
      </div>
    </div>
  );
}
