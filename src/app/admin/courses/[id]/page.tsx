"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CourseForm from "../CourseForm";
import type { Course } from "@/lib/types";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null | undefined>(undefined);

  useEffect(() => {
    getDoc(doc(db, "courses", params.id)).then((snap) => {
      setCourse(snap.exists() ? ({ id: snap.id, ...snap.data() } as Course) : null);
    });
  }, [params.id]);

  if (course === undefined) {
    return <p className="text-sm text-ink/50">Loading…</p>;
  }

  if (course === null) {
    return <p className="text-sm text-red-600">Course not found.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Edit course</h2>
      <div className="mt-6">
        <CourseForm course={course} id={params.id} />
      </div>
    </div>
  );
}
