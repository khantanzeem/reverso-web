"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, PlayCircle, Clock, ShieldCheck } from "lucide-react";
import { getVideoCourseBySlug } from "@/lib/content";
import { useAuthUser } from "../../../components/useAuthUser";
import type { VideoCourse } from "@/lib/types";

interface LessonMeta {
  id: string;
  title: string;
  duration?: string;
  isPreview: boolean;
  order: number;
  locked: boolean;
}

export default function WatchVideoCoursePage({ params }: { params: { slug: string } }) {
  const { user, loading: authLoading } = useAuthUser();
  const [course, setCourse] = useState<VideoCourse | null | undefined>(undefined);
  const [lessons, setLessons] = useState<LessonMeta[] | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getVideoCourseBySlug(params.slug).then(setCourse);
  }, [params.slug]);

  useEffect(() => {
    if (authLoading || course === undefined || course === null) return;
    (async () => {
      const headers: Record<string, string> = {};
      if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;
      const res = await fetch(`/api/course-lessons?courseId=${course.id}`, { headers });
      const data = await res.json();
      setLessons(data.lessons || []);
      setEnrolled(!!data.enrolled);
    })();
  }, [course, user, authLoading]);

  async function playLesson(lesson: LessonMeta) {
    setError("");
    setActiveLessonId(lesson.id);
    setVideoId(null);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;
    const res = await fetch("/api/lesson-video", {
      method: "POST",
      headers,
      body: JSON.stringify({ courseId: course!.id, lessonId: lesson.id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Couldn't load this video.");
      return;
    }
    setVideoId(data.videoId);
  }

  if (course === undefined || (course && lessons === null)) {
    return <div className="container-x py-16" />;
  }

  if (course === null) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-mist py-10">
      <div className="container-x grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-2xl font-bold text-navy">{course.title}</h1>
          <p className="mt-1 text-sm text-ink/60">Recorded video playlist for this course.</p>

          <div
            className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-navy shadow-lg"
            onContextMenu={(e) => e.preventDefault()}
          >
            {videoId ? (
              <iframe
                key={videoId}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&disablekb=1`}
                title="Lesson video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/50">
                {error || "Select a lesson to start watching."}
              </div>
            )}
          </div>

          {!enrolled && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-signal/30 bg-signal/5 p-4">
              <ShieldCheck className="shrink-0 text-signal-600" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-navy">Unlock the full playlist</p>
                <p className="text-ink/60">Buy this course to watch every lesson.</p>
              </div>
              <Link
                href={`/downloadable-courses/${course.slug}/checkout`}
                className="btn btn-primary ml-auto shrink-0"
              >
                Buy Now
              </Link>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <h2 className="mb-3 px-1 font-semibold text-navy">Lessons</h2>
          <div className="space-y-1">
            {lessons?.length === 0 && (
              <p className="px-1 text-sm text-ink/50">No videos added for this course yet.</p>
            )}
            {lessons?.map((l) => (
              <button
                key={l.id}
                onClick={() => !l.locked && playLesson(l)}
                disabled={l.locked}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeLessonId === l.id
                    ? "bg-signal/10 text-signal-600"
                    : l.locked
                      ? "cursor-not-allowed text-ink/40"
                      : "text-navy hover:bg-mist"
                }`}
              >
                {l.locked ? (
                  <Lock size={15} className="shrink-0" />
                ) : (
                  <PlayCircle size={15} className="shrink-0" />
                )}
                <span className="flex-1 truncate">{l.title}</span>
                {l.duration && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-ink/40">
                    <Clock size={11} /> {l.duration}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
