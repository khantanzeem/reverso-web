import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import FadeUp from "../components/FadeUp";
import Reveal from "../components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) return {};
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
  };
}

export default async function ContentPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <h1 className="text-3xl font-bold sm:text-4xl">{page.title}</h1>
          </FadeUp>
        </div>
      </header>

      {page.videoUrl && (
        <div className="container-x -mt-10 sm:-mt-14">
          <Reveal>
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-signal/30 via-signal/10 to-transparent blur-2xl" />
              <div className="aspect-video overflow-hidden rounded-2xl border border-black/5 bg-navy shadow-2xl shadow-navy/20">
                <iframe
                  src={page.videoUrl}
                  title={page.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </div>
      )}

      <div className="container-x prose-body max-w-3xl py-12">
        <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
      </div>
    </article>
  );
}
