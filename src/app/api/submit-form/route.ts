import { NextResponse } from "next/server";

// Optional: emails the team when a form is submitted.
// The submission is ALREADY saved to Firestore by the client; this is just a notification.
// If EMAIL_API_KEY is not set, it quietly does nothing so the site still works.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const apiKey = process.env.EMAIL_API_KEY;
  const to = process.env.EMAIL_TO;
  if (!apiKey || !to) {
    // Not configured yet — no-op.
    return NextResponse.json({ ok: true, notified: false });
  }

  // Example using Resend's HTTP API (swap for Brevo if you prefer).
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Reverso Website <noreply@reversosolutions.com>",
        to,
        subject: `New ${body.type} enquiry from ${body.name}`,
        text: `Name: ${body.name}\nPhone: ${body.phone}\nEmail: ${body.email}\nCourse: ${body.course ?? "-"}\nMessage: ${body.message ?? "-"}`,
      }),
    });
    return NextResponse.json({ ok: true, notified: true });
  } catch {
    return NextResponse.json({ ok: true, notified: false });
  }
}
