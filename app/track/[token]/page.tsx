import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface TrackingPageProps {
  params: { token: string };
}

export default async function TrackingPage({ params }: TrackingPageProps) {
    const { token } = await params;
  const delivery = await prisma.delivery.findUnique({
    where: { trackingToken: token },
    select: {
      status: true,
      pickupAddress: true,
      dropoffAddress: true,
      estimatedArrival: true,
      createdAt: true,

    },
  });

  if (!delivery) {
    notFound();
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Order received",
    ASSIGNED: "Driver assigned",
    IN_TRANSIT: "On the way",
    DELIVERED: "Delivered",
    FAILED: "Delivery failed",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800 border-amber-200",
    ASSIGNED: "bg-sky-50 text-sky-700 border-sky-200",
    IN_TRANSIT: "bg-violet-50 text-violet-700 border-violet-200",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
  };

  // visual progress only — derived from the status above
  const steps = ["PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED"];
  const failed = delivery.status === "FAILED";
  const currentStep = steps.indexOf(delivery.status);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">FleetTrack</span>
      </div>

      <main className="card w-full max-w-md animate-fade-in overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Track Your Delivery
              </h1>
              <p className="mt-1 text-sm text-muted">
                Order placed {new Date(delivery.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`badge ${statusColors[delivery.status]}`}>
              <span className="badge-dot" />
              {statusLabels[delivery.status]}
            </span>
          </div>

          {/* Progress */}
          {!failed && (
            <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Delivery progress">
              {steps.map((step, i) => {
                const done = i <= currentStep;
                return (
                  <li key={step} className="flex flex-col gap-2">
                    <span
                      className={`h-1.5 rounded-full transition-colors ${
                        done ? "bg-brand" : "bg-slate-200"
                      }`}
                    />
                    <span
                      className={`text-[11px] leading-tight ${
                        i === currentStep
                          ? "font-semibold text-foreground"
                          : done
                            ? "text-muted"
                            : "text-subtle"
                      }`}
                    >
                      {statusLabels[step]}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <dl className="space-y-5 border-t border-line bg-surface-muted p-6 text-sm sm:px-8">
          <div className="flex gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-slate-400 bg-surface" />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">Pickup</dt>
              <dd className="mt-0.5 font-medium text-foreground">{delivery.pickupAddress}</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand ring-4 ring-brand/15" />
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">Delivering to</dt>
              <dd className="mt-0.5 font-medium text-foreground">{delivery.dropoffAddress}</dd>
            </div>
          </div>
          {delivery.estimatedArrival && (
            <div className="rounded-lg border border-line bg-surface p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">Estimated arrival</dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {new Date(delivery.estimatedArrival).toLocaleString()}
              </dd>
            </div>
          )}
        </dl>
      </main>
    </div>
  );
}
