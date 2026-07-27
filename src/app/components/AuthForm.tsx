"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AuthForm({
  mode,
  redirectTo = "/",
}: {
  mode: "login" | "signup";
  /** Where to send the user after a successful login/signup. */
  redirectTo?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  async function handleGoogle() {
    setGoogleBusy(true);
    setError("");
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          name: cred.user.displayName || "",
          email: cred.user.email || "",
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setGoogleBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const name = String(f.get("name") || "");

    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        // Create the user's profile document.
        await setDoc(doc(db, "users", cred.user.uid), {
          name,
          email,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {mode === "signup" && (
        <label className="grid gap-1.5 text-sm font-medium text-navy">
          Full name
          <input name="name" required placeholder="Jane Doe" className="input" />
        </label>
      )}
      <label className="grid gap-1.5 text-sm font-medium text-navy">
        Email
        <input name="email" type="email" required placeholder="you@example.com" className="input" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-navy">
        Password
        <input name="password" type="password" required minLength={6} placeholder="••••••••" className="input" />
      </label>
      <button type="submit" disabled={busy} className="btn btn-primary mt-2 disabled:opacity-60">
        {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="my-1 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ink/40">
        <span className="h-px flex-1 bg-black/10" />
        or
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleBusy}
        className="flex items-center justify-center gap-3 rounded-md border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.7 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.8 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
        </svg>
        {googleBusy ? "Please wait…" : `${mode === "signup" ? "Sign up" : "Log in"} with Google`}
      </button>
    </form>
  );
}
