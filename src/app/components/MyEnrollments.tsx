"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BookOpen } from "lucide-react";
import { db } from "@/lib/firebase";
import EnrollmentCard from "./EnrollmentCard";
import type { Enrollment } from "@/lib/types";

export default function MyEnrollments({ uid }: { uid: string }) {
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);

  useEffect(() => {
    let active = true;
    getDocs(query(collection(db, "enrollments"), where("uid", "==", uid))).then((snap) => {
      if (!active) return;
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Enrollment);
      setEnrollments(list);
    });
    return () => {
      active = false;
    };
  }, [uid]);

  if (enrollments === null) return null;

  if (enrollments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white p-8 text-center">
        <BookOpen className="mx-auto text-ink/30" size={28} />
        <p className="mt-3 text-sm text-ink/60">You haven&apos;t enrolled in any courses yet.</p>
        <Link href="/courses" className="btn btn-primary mt-4 inline-flex">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {enrollments.map((e) => (
        <EnrollmentCard key={e.id} enrollment={e} />
      ))}
    </div>
  );
}
