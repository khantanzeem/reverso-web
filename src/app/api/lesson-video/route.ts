import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

/**
 * Resolves ONE lesson's real video ID, after verifying the requester is either
 * watching a free-preview lesson or is enrolled in the course. The video ID
 * never appears anywhere else in the client-facing API/HTML.
 */
export async function POST(req: NextRequest) {
  const { courseId, lessonId } = await req.json().catch(() => ({}));
  if (!courseId || !lessonId) {
    return NextResponse.json({ error: "Missing courseId or lessonId" }, { status: 400 });
  }

  const doc = await adminDb.collection("courseVideos").doc(courseId).get();
  const lessons = (doc.data()?.lessons || []) as { id: string; videoId: string; isPreview: boolean }[];
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  if (!lesson.isPreview) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Log in required" }, { status: 401 });
    }
    let uid: string;
    try {
      uid = (await adminAuth.verifyIdToken(authHeader.slice(7))).uid;
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const snap = await adminDb
      .collection("enrollments")
      .where("uid", "==", uid)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();
    if (snap.empty) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
    }
  }

  return NextResponse.json({ videoId: lesson.videoId });
}
