export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
            <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
            <path d="m3 8 9 5 9-5M12 13v8" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-foreground">Delivery Not Found</h1>
        <p className="mt-1.5 text-sm text-muted">
          This tracking link is invalid or has expired.
        </p>
      </div>
    </div>
  );
}
