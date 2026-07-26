import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Call this to make a content edit appear immediately (instead of waiting for the 60s window).
// Wire a Firestore trigger (Cloud Function) to hit this URL whenever content changes:
//   POST /api/revalidate?secret=YOUR_SECRET   body: { "path": "/" }
export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const path = typeof body.path === "string" ? body.path : "/";
  revalidatePath(path);
  return NextResponse.json({ ok: true, revalidated: path });
}
