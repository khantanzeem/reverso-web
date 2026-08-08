import {
  GraduationCap,
  Users,
  LayoutTemplate,
  ClipboardCheck,
  Presentation,
  BadgeCheck,
  UserSearch,
  FileSignature,
  ShieldCheck,
  Search,
  Megaphone,
  PenTool,
  Image as ImageIcon,
  GalleryHorizontal,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export type ProcessStep = { title: string; description: string; icon: LucideIcon };
export type FeatureItem = { title: string; description: string; icon: LucideIcon };
export type Stat = { label: string; value: string };

export interface ServiceDetail {
  slug: string;
  icon: LucideIcon;
  tagline: string;
  longDescription: string[];
  stats: Stat[];
  features: FeatureItem[];
  process: ProcessStep[];
  ctaLabel: string;
  ctaHref: string;
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "training-and-placement": {
    slug: "training-and-placement",
    icon: GraduationCap,
    tagline: "Job-oriented training built by engineers who've shipped in the industry",
    longDescription: [
      "Reverso Solutions provides job-oriented training with guidance from professionals who've worked at top MNCs. Our team of highly experienced telecom R&D engineers understands current market requirements and helps bridge the gap between industry expectations and your skill set.",
      "Every course is designed around what employers are actually hiring for right now — not generic theory. You work on real lab setups, real tools, and real project scenarios, so the certificate you walk away with actually reflects what you can do.",
      "Beyond the classroom, our placement cell works with you on resume building, mock interviews, and direct introductions to hiring partners, so training turns into an offer letter, not just a diploma.",
    ],
    stats: [
      { label: "Placement assistance", value: "100%" },
      { label: "Courses offered", value: "10+" },
      { label: "Hiring partners", value: "50+" },
      { label: "Trainer experience", value: "10+ yrs" },
    ],
    features: [
      {
        icon: ClipboardCheck,
        title: "Job-oriented curriculum",
        description: "Every module is mapped to real industry requirements, updated as the market shifts.",
      },
      {
        icon: Presentation,
        title: "MNC-experienced trainers",
        description: "Learn from telecom R&D engineers and professionals who've worked at top companies.",
      },
      {
        icon: BadgeCheck,
        title: "Hands-on labs",
        description: "Work on real tools and lab setups instead of slideware — build a portfolio, not just notes.",
      },
      {
        icon: ShieldCheck,
        title: "Dedicated placement support",
        description: "Resume prep, mock interviews, and direct introductions to our hiring partner network.",
      },
    ],
    process: [
      { icon: ClipboardCheck, title: "Free counselling", description: "We assess your background and goals to recommend the right course and batch." },
      { icon: Presentation, title: "Structured training", description: "Live sessions, hands-on labs, and assessments delivered by industry trainers." },
      { icon: BadgeCheck, title: "Certification", description: "Earn a certificate that reflects real, demonstrable skills." },
      { icon: Rocket, title: "Placement support", description: "Resume, interviews, and introductions until you land the right role." },
    ],
    ctaLabel: "Enquire about training",
    ctaHref: "/contact",
  },
  "staffing-services": {
    slug: "staffing-services",
    icon: Users,
    tagline: "10+ lakh candidates. One dedicated account manager. Fast, reliable hiring.",
    longDescription: [
      "With a database of over 10 lakh candidates, we match the right talent to your requirements — whether you're an individual planning your next career move or a company that needs to hire fast, on contract, or for a hard-to-fill specialist role.",
      "Every hiring mandate gets a dedicated account manager who understands your role requirements, culture, and timeline, so you're not sifting through irrelevant resumes — you're getting a shortlist you can actually act on.",
      "We handle sourcing, screening, background verification, and offer support end-to-end, cutting the time and overhead your internal team would otherwise spend on high-volume or niche hiring.",
    ],
    stats: [
      { label: "Candidate database", value: "10L+" },
      { label: "Shortlist turnaround", value: "48 hrs" },
      { label: "Roles filled", value: "1000+" },
      { label: "Client retention", value: "90%+" },
    ],
    features: [
      {
        icon: UserSearch,
        title: "Deep candidate database",
        description: "Access 10+ lakh pre-screened candidates across roles, seniority levels, and skill sets.",
      },
      {
        icon: FileSignature,
        title: "Contract & permanent hiring",
        description: "Flexible engagement models — contract, contract-to-hire, or direct permanent placement.",
      },
      {
        icon: ShieldCheck,
        title: "Screening & background checks",
        description: "Every shortlisted candidate is vetted so you spend time interviewing, not filtering.",
      },
      {
        icon: Users,
        title: "Dedicated account manager",
        description: "One point of contact who owns your mandate from brief to offer acceptance.",
      },
    ],
    process: [
      { icon: FileSignature, title: "Share your mandate", description: "Tell us the role, skills, and timeline — we assign a dedicated account manager." },
      { icon: UserSearch, title: "Sourcing & screening", description: "We tap our database and networks, then screen for fit before you see a resume." },
      { icon: ClipboardCheck, title: "Shortlist in 48 hours", description: "A vetted shortlist lands in your inbox, background checks included." },
      { icon: BadgeCheck, title: "Offer & onboarding support", description: "We help close the offer and support a smooth start date." },
    ],
    ctaLabel: "Hire talent with us",
    ctaHref: "/contact",
  },
  "web-solutions": {
    slug: "web-solutions",
    icon: LayoutTemplate,
    tagline: "Design, build, and grow your brand online — under one roof",
    longDescription: [
      "Complete web solutions to build and grow your brand online — from responsive website design to content strategy, SEO, and graphic design, all under one roof.",
      "We combine design and marketing so your site doesn't just look good — it's built to convert, rank, and hold up to growth. That means clean, responsive layouts, SEO baked in from day one, and a consistent visual identity across your website, social, and marketing collateral.",
      "Whether you're launching a new brand or refreshing an existing one, our team scopes the project around your goals and budget, and keeps you involved at every milestone.",
    ],
    stats: [
      { label: "Websites delivered", value: "100+" },
      { label: "Avg. turnaround", value: "2-4 wks" },
      { label: "Services offered", value: "6" },
      { label: "Post-launch support", value: "Ongoing" },
    ],
    features: [
      { icon: Search, title: "Search Engine Optimization", description: "On-page and technical SEO so your site is actually discoverable." },
      { icon: Megaphone, title: "Digital Marketing", description: "Campaigns across search and social built around measurable goals." },
      { icon: LayoutTemplate, title: "Website Design", description: "Responsive, fast, and built to reflect your brand — not a template." },
      { icon: PenTool, title: "Logo Design", description: "A distinct visual identity that scales across every touchpoint." },
      { icon: ImageIcon, title: "Graphic Design", description: "Marketing collateral, social creatives, and brand assets." },
      { icon: GalleryHorizontal, title: "Banner Design", description: "High-converting banners for web, social, and ad placements." },
    ],
    process: [
      { icon: ClipboardCheck, title: "Discovery", description: "We learn your brand, goals, and audience before touching design." },
      { icon: PenTool, title: "Design", description: "Wireframes and visual design, refined with your feedback." },
      { icon: LayoutTemplate, title: "Build", description: "Development with SEO and performance built in from the start." },
      { icon: Rocket, title: "Launch & grow", description: "We launch, then support ongoing marketing and updates." },
    ],
    ctaLabel: "Start a web project",
    ctaHref: "/contact",
  },
};
