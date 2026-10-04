export default function DashboardLoading() {
  return (
    <div className="page space-y-8" aria-busy="true" aria-label="Loading">
      <div className="space-y-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-4 w-80 max-w-full" />
      </div>
      <div className="card space-y-4 p-6">
        <div className="skeleton h-4 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="skeleton h-10" />
          <div className="skeleton h-10" />
        </div>
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card flex items-center gap-3 p-4">
            <div className="skeleton h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-40" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
