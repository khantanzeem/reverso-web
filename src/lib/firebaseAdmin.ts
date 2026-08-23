// Server-only Firebase Admin SDK. Never import this from a Client Component —
// it has full read/write access and bypasses Firestore security rules entirely.
import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount(): ServiceAccount {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }
  // Local dev fallback only: serviceAccount.json at the repo root (gitignored,
  // never present in the deployed environment). Production must set the
  // FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY env vars.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("../../serviceAccount.json");
}

const app = getApps()[0] || initializeApp({ credential: cert(getServiceAccount()) });

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
