import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import type { CourseLesson } from "@/lib/types";

interface StoredLesson extends CourseLesson {
  videoId: string;
}

/**
 * Returns lesson metadata (title, duration, preview flag, locked/unlocked) for a
 * course — never the video ID itself. The client uses this to render the lesson
 * list, then calls /api/lesson-video for one specific unlocked lesson at a time.
 */
export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  let uid: string | null = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
      uid = decoded.uid;
    } catch {
      // Invalid/expired token: treat as anonymous, don't fail the request.
    }
  }

  const doc = await adminDb.collection("courseVideos").doc(courseId).get();
  if (!doc.exists) {
    return NextResponse.json({ lessons: [] });
  }
  const lessons = (doc.data()?.lessons || []) as StoredLesson[];

  let enrolled = false;
  if (uid) {
    const snap = await adminDb
      .collection("enrollments")
      .where("uid", "==", uid)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();
    enrolled = !snap.empty;
  }

  const sanitized = lessons
    .sort((a, b) => a.order - b.order)
    .map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      isPreview: l.isPreview,
      order: l.order,
      locked: !l.isPreview && !enrolled,
    }));

  return NextResponse.json({ lessons: sanitized, enrolled });
}
