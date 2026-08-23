// The content model. Each type maps to one Firestore collection from the documentation.

export interface SiteSettings {
  phone1: string;
  phone2: string;
  email: string;
  whatsapp: string;
  hours: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  /** Per-section visibility toggles for the homepage. Missing/undefined defaults to shown. */
  sections?: {
    hero?: boolean;
    services?: boolean;
    courses?: boolean;
    staffing?: boolean;
    testimonials?: boolean;
  };
  /** Per-link visibility toggles for the header/mobile nav. Missing/undefined defaults to shown. */
  nav?: {
    about?: boolean;
    services?: boolean;
    courses?: boolean;
    contact?: boolean;
    demo?: boolean;
    videoCourses?: boolean;
  };
}

export interface Banner {
  id: string;
  image: string;
  heading: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
}

export interface Service {
  id: string;
  title: string;
  image: string;
  excerpt: string;
  bodyHtml: string;
  slug: string;
  order: number;
  active: boolean;
}

export interface StaffingSolution {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
}

export interface CourseModule {
  title: string;
  duration?: string;
  items: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  summary: string;
  description: string;
  /** Current selling price. 0 means "contact for pricing". */
  price: number;
  /**
   * Original/list price before a discount. Set higher than `price` and the UI shows
   * a strikethrough price + "X% OFF" badge. Leave unset (or equal to price) for no discount.
   */
  mrp?: number;
  duration?: string;
  prerequisites?: string;
  curriculum?: CourseModule[];
  image: string;
  published: boolean;
  order: number;
}

/**
 * A self-paced, recorded video course — distinct from `Course` (live, batch-based
 * training). No batches, no join links: purchase unlocks a video playlist.
 */
export interface VideoCourse {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  price: number;
  mrp?: number;
  image: string;
  published: boolean;
  order: number;
}

/**
 * Public lesson metadata — safe to send to any client, logged in or not.
 * Deliberately has NO video ID/URL: that only ever gets resolved server-side,
 * per request, after checking enrollment (see /api/lesson-video).
 */
export interface CourseLesson {
  id: string;
  title: string;
  duration?: string;
  /** Free-preview lessons are watchable by anyone, no enrollment needed. */
  isPreview: boolean;
  order: number;
}

export interface BatchTemplate {
  id: string;
  name: string;
  days: number[]; // 0=Sun..6=Sat
  time: string; // human-readable, e.g. "7:00 PM – 8:30 PM IST"
  joinLink: string;
  order: number;
}

export interface Enrollment {
  id: string;
  uid: string;
  email: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseImage?: string;
  price: number;
  plan: "full" | "installments";
  installments: number;
  /** "live" (default, batch/schedule based) or "video" (self-paced recorded course, no batch). */
  type?: "live" | "video";
  batchName?: string;
  batchDays?: number[];
  batchTime?: string;
  joinLink?: string;
  status: "enrolled";
  createdAt: unknown;
}

export interface FormSubmission {
  id: string;
  type: "contact" | "free-demo";
  name: string;
  email: string;
  phone: string;
  course?: string;
  message?: string;
  handled: boolean;
  createdAt: unknown;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  heading: string;
  quote: string;
  order: number;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  heroImage: string;
  bodyHtml: string;
  seoTitle: string;
  seoDescription: string;
  /** Optional YouTube embed URL (https://www.youtube.com/embed/VIDEO_ID) shown near the top of the page. */
  videoUrl?: string;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  bodyHtml: string;
  published: boolean;
  publishedAt: number; // epoch ms
}
