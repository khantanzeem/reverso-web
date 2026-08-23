"use client";

import VideoCourseForm from "../VideoCourseForm";

export default function NewVideoCoursePage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Add downloadable course</h2>
      <div className="mt-6">
        <VideoCourseForm />
      </div>
    </div>
  );
}
