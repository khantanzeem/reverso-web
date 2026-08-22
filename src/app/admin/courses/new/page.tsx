"use client";

import CourseForm from "../CourseForm";

export default function NewCoursePage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Add course</h2>
      <div className="mt-6">
        <CourseForm />
      </div>
    </div>
  );
}
