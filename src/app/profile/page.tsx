"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { LogOut, Trash2, AlertTriangle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { useAuthUser } from "../components/useAuthUser";
import FadeUp from "../components/FadeUp";
import MyEnrollments from "../components/MyEnrollments";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  async function handleDelete() {
    if (!auth.currentUser) return;
    setBusy(true);
    setError("");
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      await deleteUser(auth.currentUser);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("auth/requires-recent-login")) {
        setError(
          "For security, please log out and log back in, then try deleting your account again."
        );
      } else {
        setError(err instanceof Error ? err.message : "Couldn't delete your account.");
      }
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="container-x max-w-lg py-16" />;
  }

  if (!user) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">You&apos;re not logged in</h1>
        <p className="mt-2 text-sm text-ink/60">Log in to view your profile.</p>
        <Link href="/login" className="btn btn-primary mt-6">
          Log in
        </Link>
      </div>
    );
  }

  const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
  const memberSince = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-mist py-16">
      <div className="container-x max-w-4xl">
        <FadeUp delay={0}>
          <h1 className="mb-8 text-2xl font-bold text-navy sm:text-3xl">My Dashboard</h1>
        </FadeUp>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <FadeUp delay={0}>
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-lg shadow-navy/5">
            <div className="h-1.5 bg-gradient-to-r from-signal to-navy" />
            <div className="p-8">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-signal/20"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
                    {initial}
                  </span>
                )}
                <div>
                  <h1 className="text-xl font-bold text-navy">
                    {user.displayName || "Your account"}
                  </h1>
                  <p className="text-sm text-ink/60">{user.email}</p>
                </div>
              </div>

              <dl className="mt-8 space-y-4 border-t border-black/5 pt-6 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/50">Email</dt>
                  <dd className="font-medium text-navy">{user.email}</dd>
                </div>
                {memberSince && (
                  <div className="flex justify-between">
                    <dt className="text-ink/50">Member since</dt>
                    <dd className="font-medium text-navy">{memberSince}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink/50">Sign-in method</dt>
                  <dd className="font-medium text-navy">
                    {user.providerData[0]?.providerId === "google.com"
                      ? "Google"
                      : "Email & password"}
                  </dd>
                </div>
              </dl>

              <button
                onClick={handleLogout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-mist"
              >
                <LogOut size={16} />
                Log out
              </button>

              <div className="mt-8 border-t border-black/5 pt-6">
                {!confirmingDelete ? (
                  <button
                    onClick={() => setConfirmingDelete(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                  >
                    <Trash2 size={16} />
                    Delete account
                  </button>
                ) : (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex gap-2 text-sm font-semibold text-red-700">
                      <AlertTriangle size={18} className="shrink-0" />
                      This permanently deletes your account and profile data. This can&apos;t be
                      undone.
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={handleDelete}
                        disabled={busy}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                      >
                        {busy ? "Deleting…" : "Yes, delete my account"}
                      </button>
                      <button
                        onClick={() => setConfirmingDelete(false)}
                        disabled={busy}
                        className="rounded-md border border-black/10 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <div>
            <h2 className="mb-4 text-lg font-bold text-navy">My Courses</h2>
            <MyEnrollments uid={user.uid} />
          </div>
        </FadeUp>
        </div>
      </div>
    </div>
  );
}
