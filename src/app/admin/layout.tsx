"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  ShieldAlert,
  BookOpen,
  CalendarClock,
  FileText,
} from "lucide-react";
import { useIsAdmin } from "../components/useIsAdmin";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/batches", label: "Batches", icon: CalendarClock },
  { href: "/admin/enrollments", label: "Enrollments", icon: GraduationCap },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/content", label: "Site Content", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useIsAdmin();
  const pathname = usePathname();

  if (loading) {
    return <div className="container-x py-16" />;
  }

  if (!user) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Log in to continue</h1>
        <p className="mt-2 text-sm text-ink/60">You need an admin account to view this page.</p>
        <Link href="/login?redirect=/admin" className="btn btn-primary mt-6">
          Log in
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-x max-w-lg py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-navy">Not authorized</h1>
        <p className="mt-2 text-sm text-ink/60">
          Your account doesn&apos;t have admin access to this area.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-mist">
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <h1 className="mb-4 text-lg font-bold text-navy">Admin</h1>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((item) => {
              const active =
                item.href === "/admin" ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-navy text-white" : "text-ink/70 hover:bg-white"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
