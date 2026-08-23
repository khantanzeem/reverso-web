"use client";

import LessonsEditor from "../../../components/LessonsEditor";

export default function CourseVideosPage({ params }: { params: { id: string } }) {
  return (
    <LessonsEditor
      entityId={params.id}
      titleCollection="courses"
      backHref="/admin/courses"
      backLabel="Back to courses"
    />
  );
}
