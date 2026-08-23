"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, ChevronDown, GraduationCap, PlayCircle } from "lucide-react";
import { getCourseBySlug } from "@/lib/content";
import { nextClassDate, batchDaysLabel, parseTimeLabel } from "@/lib/batch";
import CourseCurriculum from "./CourseCurriculum";
import type { Enrollment, Course } from "@/lib/types";

export default function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  if (enrollment.type === "video") {
    return <VideoEnrollmentCard enrollment={enrollment} />;
  }
  return <LiveEnrollmentCard enrollment={enrollment} />;
}

function VideoEnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        {enrollment.courseImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={enrollment.courseImage}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-signal/10 px-2.5 py-1 text-xs font-semibold text-signal-600">
            <PlayCircle size={12} /> Self-paced video course
          </span>
          <h3 className="mt-1.5 font-semibold text-navy">{enrollment.courseTitle}</h3>
        </div>
      </div>
      <div className="border-t border-black/5 p-6">
        <Link
          href={`/downloadable-courses/${enrollment.courseSlug}/watch`}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <PlayCircle size={16} /> Watch videos
        </Link>
      </div>
    </div>
  );
}

function LiveEnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [showSyllabus, setShowSyllabus] = useState(false);

  useEffect(() => {
    let active = true;
    getCourseBySlug(enrollment.courseSlug).then((c) => {
      if (active) setCourse(c);
    });
    return () => {
      active = false;
    };
  }, [enrollment.courseSlug]);

  const next = nextClassDate({
    days: enrollment.batchDays || [],
    ...parseTimeLabel(enrollment.batchTime || ""),
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        {enrollment.courseImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={enrollment.courseImage}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-signal/10 px-2.5 py-1 text-xs font-semibold text-signal-600">
            <GraduationCap size={12} /> Enrolled
          </span>
          <h3 className="mt-1.5 font-semibold text-navy">{enrollment.courseTitle}</h3>
          <p className="text-sm text-ink/60">{enrollment.batchName}</p>
        </div>
      </div>

      <div className="grid gap-4 border-t border-black/5 bg-mist/60 p-6 sm:grid-cols-3">
        <div className="flex items-start gap-2 text-sm">
          <Calendar size={16} className="mt-0.5 shrink-0 text-signal-600" />
          <div>
            <p className="text-ink/50">Class days</p>
            <p className="font-medium text-navy">{batchDaysLabel(enrollment.batchDays || [])}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Clock size={16} className="mt-0.5 shrink-0 text-signal-600" />
          <div>
            <p className="text-ink/50">Timing</p>
            <p className="font-medium text-navy">{enrollment.batchTime}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Calendar size={16} className="mt-0.5 shrink-0 text-signal-600" />
          <div>
            <p className="text-ink/50">Next class</p>
            <p className="font-medium text-navy">
              {next.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              , {next.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 p-6">
        <a
          href={enrollment.joinLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Video size={16} /> Join Class
        </a>
        <Link
          href={`/learn/${enrollment.courseSlug}`}
          className="inline-flex items-center gap-2 rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-mist"
        >
          <PlayCircle size={16} /> Watch Recordings
        </Link>
        {course?.curriculum && course.curriculum.length > 0 && (
          <button
            onClick={() => setShowSyllabus((v) => !v)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors hover:text-signal-600"
          >
            {showSyllabus ? "Hide" : "View"} full syllabus
            <ChevronDown size={16} className={`transition-transform ${showSyllabus ? "rotate-180" : ""}`} />
          </button>
        )}
        <Link
          href={`/courses/${enrollment.courseSlug}`}
          className="text-sm font-semibold text-ink/60 transition-colors hover:text-signal-600"
        >
          View course page
        </Link>
      </div>

      {showSyllabus && course?.curriculum && (
        <div className="border-t border-black/5 p-6">
          <CourseCurriculum modules={course.curriculum} />
        </div>
      )}
    </div>
  );
}
