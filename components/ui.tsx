// Presentational building blocks shared across dashboard pages.
// No data fetching or state here — styling only.

type IconProps = { className?: string };

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const Icons = {
  Overview: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  Drivers: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" />
    </svg>
  ),
  Package: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5" />
    </svg>
  ),
  Map: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </svg>
  ),
  Team: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Logout: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11" />
    </svg>
  ),
  Menu: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  Close: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  Plus: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Phone: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  Mail: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  Check: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M5 12.5 10 17 19 7" />
    </svg>
  ),
  Alert: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16h.01" />
    </svg>
  ),
  ArrowRight: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Truck: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  ),
  Radar: ({ className }: IconProps) => (
    <svg {...iconBase} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
};

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && (
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-brand-ink">
            {eyebrow}
          </p>
        )}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-subtitle">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function LivePill({ label }: { label: string }) {
  return (
    <span className="badge self-start border-line bg-surface py-1 text-muted shadow-card sm:self-auto">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="alert-error animate-fade-in">
      <Icons.Alert className="mt-px h-4 w-4 shrink-0" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface/60 px-6 py-14 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-subtle shadow-card">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card flex items-center gap-3 p-4">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-40" />
            <div className="skeleton h-3 w-24" />
          </div>
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CountChip({ count }: { count: number }) {
  return (
    <span className="rounded-md bg-slate-200/70 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted tabular-nums">
      {count}
    </span>
  );
}

/** Turns enum values like IN_TRANSIT into "In transit". */
export function humanize(value: string) {
  const s = value.toLowerCase().replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Stable, soft avatar tint derived from a string. */
const AVATAR_TINTS = [
  "bg-amber-100 text-amber-800",
  "bg-sky-100 text-sky-800",
  "bg-emerald-100 text-emerald-800",
  "bg-violet-100 text-violet-800",
  "bg-rose-100 text-rose-800",
  "bg-teal-100 text-teal-800",
];

export function avatarTint(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_TINTS[Math.abs(h) % AVATAR_TINTS.length];
}
