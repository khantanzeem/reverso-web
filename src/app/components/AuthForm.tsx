"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
      router.push("/");
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
    </form>
  );
}
