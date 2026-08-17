"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from "next/font/google";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const LOG_ENTRIES = [
  "Driver #04 \u2192 IN_TRANSIT",
  "Delivery #128 \u2192 ASSIGNED",
  "Driver #02 \u2192 geofence: Warehouse B",
  "Delivery #131 \u2192 DELIVERED",
  "Driver #07 \u2192 IN_TRANSIT",
  "Delivery #129 \u2192 ASSIGNED",
  "Driver #01 \u2192 status: ACTIVE",
  "Delivery #130 \u2192 IN_TRANSIT",
];

const ROLES = [
  {
    label: "Dispatcher",
    desc: "Live map of every active vehicle, delivery creation and assignment, and a status board that updates without a refresh.",
  },
  {
    label: "Fleet Manager",
    desc: "An operational overview across the whole company \u2014 no driver-level noise, just what's moving and what isn't.",
  },
  {
    label: "Customer",
    desc: "One tracking link, no account required. Sees status and ETA \u2014 nothing about the driver, the vehicle, or anyone else's order.",
  },
];

const LAYERS = [
  { name: "Route middleware", detail: "blocks the wrong role before a page ever renders" },
  { name: "tRPC role tiers", detail: "public / protected / staff procedures" },
  { name: "Tenant-scoped queries", detail: "every row filtered by companyId from the session" },
];

const CREDENTIALS = [
  { role: "Dispatcher", email: "dispatcher@acme.com" },
  { role: "Fleet Manager", email: "manager@acme.com" },
  { role: "Customer", email: "customer@acme.com" },
];

const STACK = [
  "Next.js",
  "TypeScript",
  "tRPC",
  "Prisma",
  "PostgreSQL",
  "NextAuth",
  "Pusher",
  "Leaflet",
];

function useClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const format = () =>
      new Date().toLocaleTimeString("en-GB", { hour12: false });
    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useLog() {
  const [entries, setEntries] = useState<{ text: string; time: string }[]>(
    () => LOG_ENTRIES.slice(0, 3).map((text) => ({ text, time: "" }))
  );

  useEffect(() => {

    setEntries((prev) =>
      prev.map((entry) => ({
        ...entry,
        time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      }))
    );

    let i = 3;
    const id = setInterval(() => {
      const text = LOG_ENTRIES[i % LOG_ENTRIES.length];
      const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setEntries((prev) => [{ text, time }, ...prev].slice(0, 4));
      i++;
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return entries;
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.72 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.19 1.84 1.19 3.1 0 4.45-2.7 5.42-5.27 5.71.42.36.78 1.08.78 2.17 0 1.57-.02 2.83-.02 3.22 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function CopyRow({ role, email }: { role: string; email: string }) {
  const [copied, setCopied] = useState(false);
  const value = `${email} / password123`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {

    }
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#232A31] py-3 last:border-none">
      <div className="min-w-0">
        <div className="font-mono text-[11px] uppercase tracking-wider text-[#8B96A0]">
          {role}
        </div>
        <div className="truncate font-mono text-sm text-[#E7EBEE]">
          {email} <span className="text-[#8B96A0]">/ password123</span>
        </div>
      </div>
      <button
        onClick={copy}
        className="shrink-0 rounded border border-[#2C343C] px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#8B96A0] transition-colors hover:border-[#F5A623] hover:text-[#F5A623] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5A623]"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function LandingPage() {
  const time = useClock();
  const log = useLog();

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[#0B0E11] text-[#E7EBEE]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <style jsx global>{`
        @keyframes dot-move {
          0% { left: 6%; top: 68%; }
          25% { left: 32%; top: 30%; }
          50% { left: 58%; top: 52%; }
          75% { left: 78%; top: 22%; }
          100% { left: 94%; top: 40%; }
        }
        .dispatch-dot {
          animation: dot-move 7s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .dispatch-dot { animation: none; left: 58%; top: 52%; }
          .log-enter { animation: none !important; }
        }
        @keyframes log-enter {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .log-enter { animation: log-enter 0.4s ease-out; }
      `}</style>

      {/* status bar */}
      <div className="border-b border-[#1C2328]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[15px] font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FLEETTRACK
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B96A0]">
              / ops console
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#8B96A0]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3ECF8E]" />
            LIVE
            <span className="text-[#4A545C]">·</span>
            {time}
          </div>
        </div>
      </div>

      {/* hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 md:pt-24">
        <h1
          className="max-w-2xl text-5xl leading-[1.05] tracking-tight md:text-6xl"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          See your whole fleet move, live.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#8B96A0]">
          A dispatcher watches every vehicle on a live map. A customer opens
          one link and sees a status - no account required. And a delivery&apos;s
          status can&apos;t be forged from the browser, because the state machine
          that decides it runs on the server, not the client.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/signup"
            className="rounded bg-[#F5A623] px-5 py-2.5 text-sm font-medium text-[#0B0E11] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded border border-[#2C343C] px-5 py-2.5 text-sm font-medium text-[#E7EBEE] transition-colors hover:border-[#F5A623]"
          >
            Sign in
          </Link>
          <a
            href="https://github.com/Abhinandan-Dwivedi/fleet-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border border-[#2C343C] px-5 py-2.5 text-sm font-medium text-[#E7EBEE] transition-colors hover:border-[#F5A623] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
          >
            <GitHubIcon className="h-4 w-4" />
            View source
          </a>
        </div>

        {/* signature: live ops panel */}
        <div className="mt-14 overflow-hidden rounded-lg border border-[#232A31] bg-[#12161B]">
          <div className="flex items-center justify-between border-b border-[#232A31] px-4 py-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8B96A0]">
              Activity - Acme Logistics (demo)
            </span>
            <span className="font-mono text-[11px] text-[#3ECF8E]">
              ● streaming
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
            {/* mini map */}
            <div className="relative h-56 border-b border-[#232A31] bg-[#0E1216] md:border-b-0 md:border-r">
              <svg
                className="absolute inset-0 h-full w-full opacity-[0.35]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={(i + 1) * 14}
                    y1="0"
                    x2={(i + 1) * 14}
                    y2="100"
                    stroke="#2C343C"
                    strokeWidth="0.3"
                  />
                ))}
                {Array.from({ length: 4 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={(i + 1) * 22}
                    x2="100"
                    y2={(i + 1) * 22}
                    stroke="#2C343C"
                    strokeWidth="0.3"
                  />
                ))}
                <path
                  d="M 6 68 Q 20 20 32 30 T 58 52 Q 70 15 78 22 T 94 40"
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                />
              </svg>
              <div
                className="dispatch-dot absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3ECF8E] shadow-[0_0_0_4px_rgba(62,207,142,0.18)]"
                aria-hidden
              />
            </div>

            {/* ticking log */}
            <div className="flex flex-col gap-2.5 px-4 py-4">
              {log.map((entry, i) => (
                <div
                  key={`${entry.time}-${i}`}
                  className={`flex items-baseline gap-2 font-mono text-xs ${i === 0 ? "log-enter text-[#E7EBEE]" : "text-[#6B7680]"
                    }`}
                >
                  <span className="shrink-0 text-[#4A545C]">{entry.time}</span>
                  <span>{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* roles */}
      <section className="border-t border-[#1C2328]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2
            className="text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Built for three very different screens
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ROLES.map((role) => (
              <div
                key={role.label}
                className="rounded-lg border border-[#232A31] bg-[#12161B] p-5"
              >
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#F5A623]">
                  {role.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#8B96A0]">
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* architecture */}
      <section className="border-t border-[#1C2328]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2
            className="text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Enforced at three layers, not one
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#8B96A0]">
            A customer account can&apos;t reach a dispatcher route — not because
            the UI hides the link, but because each layer below independently
            refuses the request.
          </p>
          <div className="mt-8 divide-y divide-[#232A31] rounded-lg border border-[#232A31] bg-[#12161B]">
            {LAYERS.map((layer, i) => (
              <div key={layer.name} className="flex items-center gap-4 px-5 py-4">
                <span className="font-mono text-xs text-[#4A545C]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-sm text-[#E7EBEE]">
                  {layer.name}
                </span>
                <span className="hidden text-sm text-[#8B96A0] md:inline">
                  {layer.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* try it */}
      <section className="border-t border-[#1C2328]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2
            className="text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Try it — no signup
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#8B96A0]">
            Seeded demo accounts for Acme Logistics. Same password for all
            three.
          </p>
          <div className="mt-6 max-w-md rounded-lg border border-[#232A31] bg-[#12161B] px-5">
            {CREDENTIALS.map((c) => (
              <CopyRow key={c.email} role={c.role} email={c.email} />
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-[#1C2328]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-[#4A545C]">
            {STACK.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <a
            href="https://github.com/Abhinandan-Dwivedi/fleet-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#8B96A0] transition-colors hover:text-[#F5A623]"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            Github.com
          </a>
        </div>
      </footer>
    </div>
  );
}