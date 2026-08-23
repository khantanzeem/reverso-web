"use client";

import LessonsEditor from "../../../components/LessonsEditor";

export default function VideoCourseVideosPage({ params }: { params: { id: string } }) {
  return (
    <LessonsEditor
      entityId={params.id}
      titleCollection="videoCourses"
      backHref="/admin/video-courses"
      backLabel="Back to downloadable courses"
    />
  );
}
