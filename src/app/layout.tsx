import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
import { getSiteSettings } from "@/lib/content";

// Revalidate every 60s so content edits appear without a redeploy.
// (For instant updates, call the /api/revalidate endpoint from a Firestore trigger.)
export const revalidate = 60;

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Reverso Solutions — Training, Placement & Web Solutions",
  description:
    "Job-oriented telecom and IT training, staffing services, and web solutions.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <MotionConfig reducedMotion="user">
          <Header settings={settings} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer settings={settings} />
          <FloatingContact settings={settings} />
        </MotionConfig>
      </body>
    </html>
  );
}
