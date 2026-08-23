import { notFound } from "next/navigation";
import { getVideoCourseBySlug } from "@/lib/content";
import VideoCheckoutClient from "../../../components/VideoCheckoutClient";

export const metadata = { title: "Checkout — Reverso Solutions" };

export default async function VideoCourseCheckout({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getVideoCourseBySlug(params.slug);
  if (!course) notFound();

  return <VideoCheckoutClient course={course} />;
}
