"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const signup = trpc.auth.signup.useMutation({
    onError: (err) => setError(err.message),
    onSuccess: async () => {
      // auto-login right after account creation, no separate step
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Account created, but sign-in failed. Try logging in.");
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signup.mutate({ companyName, name, email, password });
  };

  // NOTE: `signup.isPending` is React Query v5 syntax. If this project is on
  // @tanstack/react-query v4, swap it for `signup.isLoading` in both spots below.

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0d1117]">
      {/* Left — brand / context panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#10141a] border-r border-white/5">
        {/* ambient grid + glow */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "#f2a63c" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "#3fb6ae" }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#f2a63c" }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ background: "#f2a63c" }}
            />
          </span>
          <span className="font-semibold tracking-[0.15em] text-sm text-white">
            FLEETTRACK
          </span>
        </div>

        {/* Decorative marketing copy — not real page structure, so this is a
            styled <p>, not an <h2>. The form's <h1> below is the page's only
            real heading at this level. */}
        <div className="relative z-10 max-w-md">
          <p className="text-4xl font-semibold text-white leading-tight tracking-tight">
            Run your fleet from
            <br />
            one dispatch console.
          </p>
          <p className="mt-4 text-white/50 text-[15px] leading-relaxed">
            Track drivers in real time, manage vehicles, and keep every
            delivery on schedule - built for teams who can&apos;t afford to
            lose a shipment.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {[
              "Live GPS tracking, no polling delay",
              "Role-based access for your whole team",
              "Delivery history & audit trail built in",
            ].map((line) => (
              <div key={line} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1f3d3a]">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.5L4.8 8.8L9.5 3.5"
                      stroke="#3fb6ae"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm text-white/70">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/30 font-mono">
          {/* © {new Date().getFullYear()} Fleetline — dispatch console */}
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-[#f7f8fa]">
        <div className="w-full max-w-sm">
          {/* mobile brand mark */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#f2a63c" }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ background: "#f2a63c" }}
              />
            </span>
            <span className="font-semibold tracking-[0.15em] text-sm text-[#10141a]">
              FLEETTRACK
            </span>
          </div>

          {/* the page's actual, only h1 */}
          <h1 className="text-2xl font-semibold text-[#10141a] tracking-tight">
            Create your company account
          </h1>
          <p className="text-sm text-[#6b7280] mt-1.5 mb-7 leading-relaxed">
            You&apos;ll be set up as the fleet manager - invite your team
            after.
          </p>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-2.5 mb-5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-100"
            >
              <svg
                className="mt-0.5 shrink-0"
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.4" />
                <path d="M8 4.5V8.5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="8" cy="11" r="0.9" fill="#dc2626" />
              </svg>
              <p className="text-sm text-red-700 leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Company name">
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Speedy Deliveries"
                autoComplete="organization"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Your name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className={inputClass}
              />
            </Field>

            <Field label="Password" hint="At least 8 characters">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-0 top-0 h-full px-3 flex items-center text-[#a3a8b3] hover:text-[#10141a] transition-colors
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400 rounded-r-lg"
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 9 4 10 7-.5 1.5-1.4 3-2.7 4.2M6.3 6.3C4.2 7.6 2.6 9.6 2 12c1 3 5 7 10 7 1.4 0 2.7-.3 3.9-.8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={signup.isPending}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-[#10141a] text-white text-sm font-medium py-2.5 rounded-lg
                         transition-all hover:bg-[#1b222a] active:scale-[0.99]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              {signup.isPending && (
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity="0.25"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {signup.isPending ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-[#6b7280] text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#10141a] font-medium hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-[#e2e4e9] bg-white rounded-lg px-3.5 py-2.5 text-sm text-[#10141a] " +
  "placeholder:text-[#a3a8b3] transition-shadow " +
  "focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-[#10141a]">{label}</span>
        {hint && <span className="text-xs text-[#a3a8b3]">{hint}</span>}
      </div>
      {children}
    </label>
  );
}