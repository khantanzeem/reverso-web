import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/content";
import CheckoutClient from "../../../components/CheckoutClient";

export const metadata = { title: "Checkout — Reverso Solutions" };

export default async function CourseCheckout({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  return <CheckoutClient course={course} />;
}
