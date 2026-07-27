import ContactForm from "../components/ContactForm";
import { getSiteSettings, getCourses } from "@/lib/content";
import FadeUp from "../components/FadeUp";
import Reveal from "../components/Reveal";

export const metadata = { title: "Contact — Reverso Solutions" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { course?: string };
}) {
  const [settings, courses] = await Promise.all([getSiteSettings(), getCourses()]);
  return (
    <>
      <header className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <h1 className="text-3xl font-bold sm:text-4xl">Contact us</h1>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="mt-2 text-white/70">
              Questions about a course or a project? Send us a note.
            </p>
          </FadeUp>
        </div>
      </header>
      <div className="container-x grid gap-12 py-12 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-navy">Send a message</h2>
            <div className="mt-6">
              <ContactForm type="contact" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div id="demo" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-navy">Book a free demo</h2>
            <div className="mt-6">
              <ContactForm type="free-demo" courses={courses} defaultCourseSlug={searchParams.course} />
            </div>
            {settings && (
              <div className="mt-8 rounded-xl bg-mist p-6 text-sm text-ink/80">
                <p className="font-semibold text-navy">Reach us directly</p>
                <p className="mt-2">{settings.address}</p>
                <p>{settings.phone1} · {settings.phone2}</p>
                <p>{settings.email}</p>
                <p>{settings.hours}</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </>
  );
}
