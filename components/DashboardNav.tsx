"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Icons, avatarTint, humanize } from "@/components/ui";

interface DashboardNavProps {
  userName: string;
  userRole: string;
}

const ICONS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  "/dashboard": Icons.Overview,
  "/dashboard/drivers": Icons.Drivers,
  "/dashboard/deliveries": Icons.Package,
  "/dashboard/map": Icons.Map,
  "/dashboard/team": Icons.Team,
};

export function DashboardNav({ userName, userRole }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const staffLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/drivers", label: "Drivers" },
  { href: "/dashboard/deliveries", label: "Deliveries" },
  { href: "/dashboard/map", label: "Live Map" },
  { href: "/dashboard/team", label: "Team" },
];

  const customerLinks = [{ href: "/dashboard", label: "Overview" }];

  const links = userRole === "CUSTOMER" ? customerLinks : staffLinks;

  // close the mobile drawer on Escape (link clicks close it too)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const brand = (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-ink">
        <Icons.Radar className="h-4 w-4" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-white">
        FleetTrack
      </span>
    </Link>
  );

  const nav = (
    <nav aria-label="Dashboard" className="flex flex-col gap-0.5">
      <p className="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
        Operations
      </p>
      {links.map((link) => {
        const active = pathname === link.href;
        const Icon = ICONS[link.href] ?? Icons.Overview;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setMobileOpen(false)}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand ${
              active
                ? "bg-white/[0.08] text-white"
                : "text-white/60 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            {active && (
              <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-brand" aria-hidden />
            )}
            <Icon
              className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                active ? "text-brand" : "text-white/45 group-hover:text-white/80"
              }`}
            />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const userCard = (
    <div className="border-t border-white/[0.07] pt-4">
      <div className="flex items-center gap-3 px-1">
        <div className={`avatar h-9 w-9 text-xs ${avatarTint(userName)}`}>
          {userName[0]?.toUpperCase() ?? "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{userName}</p>
          <p className="truncate text-xs text-white/45">{humanize(userRole)}</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-brand"
      >
        <Icons.Logout className="h-[18px] w-[18px]" />
        Sign Out
      </button>
    </div>
  );

  const sidebarBody = (
    <div className="flex h-full flex-col gap-8 px-4 py-5">
      <div className="px-1">{brand}</div>
      <div className="flex-1">{nav}</div>
      {userCard}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] bg-ink lg:block">
        {sidebarBody}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-ink/95 px-4 backdrop-blur lg:hidden">
        {brand}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          className="-mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Icons.Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 animate-[fade-in_0.2s_ease-out] bg-ink/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] animate-slide-in bg-ink shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Icons.Close className="h-5 w-5" />
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}
    </>
  );
}
