"use client";

import Link from "next/link";
import { useAuthUser } from "./useAuthUser";
import { useIsAdmin } from "./useIsAdmin";

export default function AuthNav() {
  const { user, loading } = useAuthUser();
  const { isAdmin } = useIsAdmin();

  if (loading) {
    return <span className="h-9 w-20" aria-hidden />;
  }

  if (user) {
    const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
    return (
      <span className="flex items-center gap-4">
        {isAdmin && (
          <Link href="/admin" className="nav-link">
            Admin
          </Link>
        )}
        <Link
          href="/profile"
          className="flex items-center gap-2 nav-link"
          aria-label="Your profile"
        >
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
              {initial}
            </span>
          )}
        </Link>
      </span>
    );
  }

  return (
    <>
      <Link href="/login" className="nav-link">
        Login
      </Link>
      <Link href="/signup" className="btn btn-primary">
        Sign up
      </Link>
    </>
  );
}
