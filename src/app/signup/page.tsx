import Link from "next/link";
import AuthForm from "../components/AuthForm";
import FadeUp from "../components/FadeUp";

export const metadata = { title: "Sign up — Reverso Solutions" };

export default function SignupPage() {
  return (
    <div className="flex min-h-[75vh] items-center bg-mist py-16">
      <div className="container-x max-w-md">
        <FadeUp delay={0}>
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-lg shadow-navy/5">
            <div className="h-1.5 bg-gradient-to-r from-signal to-navy" />
            <div className="p-8">
              <h1 className="text-2xl font-bold text-navy">Create your account</h1>
              <p className="mt-1 text-sm text-ink/60">Sign up to enroll and track courses.</p>
              <div className="mt-8">
                <AuthForm mode="signup" />
              </div>
              <p className="mt-6 text-sm text-ink/60">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-signal-600 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
