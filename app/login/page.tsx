"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink">
      {/* Left — brand / context panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-ink border-r border-white/5">
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
          style={{ background: "#3fb6ae" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "#F5A623" }}
        />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#F5A623" }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ background: "#F5A623" }}
            />
          </span>
          <span className="font-semibold tracking-[0.15em] text-sm text-white">
            FLEETTRACK
          </span>
        </div>

        {/* Decorative — a styled <p>, not a heading. The form's <h1> is the
            only real heading on this page. */}
        <div className="relative z-10 max-w-md">
          <p className="text-4xl font-semibold text-white leading-tight tracking-tight">
            Every driver.
            <br />
            Every delivery.
            <br />
            One live view.
          </p>
          <p className="mt-4 text-white/50 text-[15px] leading-relaxed">
            Sign back in to pick up right where dispatch left off.
          </p>

          <div className="mt-10 flex items-center gap-6">
            {[
              { label: "ACTIVE", color: "#F5A623" },
              { label: "IDLE", color: "#3fb6ae" },
              { label: "OFFLINE", color: "#5c6774" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="font-mono text-[11px] tracking-widest text-white/50">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/30 font-mono">
        {/* © {new Date().getFullYear()} Fleetline — dispatch console */}
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-sm">
          {/* mobile brand mark */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#F5A623" }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ background: "#F5A623" }}
              />
            </span>
            <span className="font-semibold tracking-[0.15em] text-sm text-[#10141a]">
              FLEETTRACK
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-[#10141a] tracking-tight">
            Sign in to Fleettrack
          </h1>
          <p className="text-sm text-[#6b7280] mt-1.5 mb-7 leading-relaxed">
            Welcome back - enter your details to reach the dispatch console.
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

            <Field
              label="Password"
              action={
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#6b7280] hover:text-[#10141a] hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              }
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-0 top-0 h-full px-3 flex items-center text-[#a3a8b3] hover:text-[#10141a] transition-colors
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand rounded-r-lg"
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
              disabled={isSubmitting}
              className="btn btn-primary mt-2 w-full"
            >
              {isSubmitting && (
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
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-[#6b7280] text-center mt-6">
            New company?{" "}
            <Link
              href="/signup"
              className="text-[#10141a] font-medium hover:underline underline-offset-2"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClass = "input";

function Field({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-[#10141a]">{label}</span>
        {action}
      </div>
      {children}
    </label>
  );
}