import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <p className="font-mono text-sm font-medium tracking-[0.2em] text-brand-ink">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/dashboard" className="btn btn-primary mt-8">
        Back to dashboard
      </Link>
    </div>
  );
}
