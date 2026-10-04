import Link from "next/link";
import { auth } from "@/lib/auth";
import { Icons, avatarTint, humanize } from "@/components/ui";

const SHORTCUTS = [
  {
    href: "/dashboard/deliveries",
    title: "Deliveries",
    description: "Create dispatch requests and assign drivers.",
    icon: Icons.Package,
  },
  {
    href: "/dashboard/map",
    title: "Live Map",
    description: "Watch every active vehicle in real time.",
    icon: Icons.Map,
  },
  {
    href: "/dashboard/drivers",
    title: "Drivers",
    description: "Onboard drivers and check availability.",
    icon: Icons.Drivers,
  },
  {
    href: "/dashboard/team",
    title: "Team",
    description: "Invite dispatchers and fleet managers.",
    icon: Icons.Team,
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const name = session?.user.name ?? "";
  const isCustomer = session?.user.role === "CUSTOMER";

  return (
    <div className="page animate-fade-in space-y-8">
      {/* Welcome */}
      <section className="card relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className={`avatar h-14 w-14 text-xl ${avatarTint(name || "U")}`}>
            {session?.user.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand-ink">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
              Welcome back, {session?.user.name}
            </h1>

            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
              You&apos;re logged in as
              <span className="badge border-line bg-surface-muted text-foreground">
                <span className="badge-dot text-brand" />
                {humanize(session?.user.role ?? "")}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Shortcuts (staff only — customers only have the overview) */}
      {!isCustomer && (
        <section>
          <h2 className="section-label mb-3">Jump to</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SHORTCUTS.map(({ href, title, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="card card-interactive group flex flex-col p-5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-muted text-foreground transition-colors group-hover:border-brand/40 group-hover:bg-brand/10 group-hover:text-brand-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-4 flex items-center justify-between text-sm font-semibold text-foreground">
                  {title}
                  <Icons.ArrowRight className="h-4 w-4 -translate-x-1 text-subtle opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
                <span className="mt-1 text-sm leading-relaxed text-muted">
                  {description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
