// Server-side content fetchers. These run in server components at build time and on
// revalidation. They use the client SDK (public reads are allowed by the security rules),
// so no service account is needed just to render the site.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  SiteSettings,
  Banner,
  Service,
  StaffingSolution,
  Course,
  Testimonial,
  Page,
  NewsPost,
} from "./types";

function withId<T>(d: { id: string; data: () => Record<string, unknown> }): T {
  return { id: d.id, ...d.data() } as unknown as T;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, "siteSettings", "global"));
  return snap.exists() ? (snap.data() as SiteSettings) : null;
}

export async function getBanners(): Promise<Banner[]> {
  const q = query(
    collection(db, "banners"),
    where("active", "==", true),
    orderBy("order")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<Banner>(d));
}

export async function getServices(): Promise<Service[]> {
  const q = query(
    collection(db, "services"),
    where("active", "==", true),
    orderBy("order")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<Service>(d));
}

export async function getStaffingSolutions(): Promise<StaffingSolution[]> {
  const q = query(
    collection(db, "staffingSolutions"),
    where("active", "==", true),
    orderBy("order")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<StaffingSolution>(d));
}

export async function getCourses(): Promise<Course[]> {
  const q = query(
    collection(db, "courses"),
    where("published", "==", true),
    orderBy("order")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<Course>(d));
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const snap = await getDocs(
    query(collection(db, "courses"), where("slug", "==", slug))
  );
  return snap.empty ? null : withId<Course>(snap.docs[0]);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const snap = await getDocs(
    query(collection(db, "testimonials"), orderBy("order"))
  );
  return snap.docs.map((d) => withId<Testimonial>(d));
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const snap = await getDocs(
    query(collection(db, "pages"), where("slug", "==", slug))
  );
  return snap.empty ? null : withId<Page>(snap.docs[0]);
}

export async function getNews(): Promise<NewsPost[]> {
  const q = query(
    collection(db, "news"),
    where("published", "==", true),
    orderBy("publishedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<NewsPost>(d));
}
