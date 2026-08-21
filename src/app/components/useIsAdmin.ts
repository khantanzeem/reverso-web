"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthUser } from "./useAuthUser";

export function useIsAdmin() {
  const { user, loading: authLoading } = useAuthUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    getDoc(doc(db, "admins", user.uid))
      .then((snap) => {
        if (active) setIsAdmin(snap.exists());
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      });
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return { user, loading: authLoading || isAdmin === null, isAdmin: !!isAdmin };
}
