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
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  summary: string;
  description: string;
  price: number;
  image: string;
  published: boolean;
  order: number;
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
