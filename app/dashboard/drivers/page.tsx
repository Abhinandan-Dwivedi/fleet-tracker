"use client";

import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  CountChip,
  EmptyState,
  ErrorAlert,
  Icons,
  ListSkeleton,
  LivePill,
  PageHeader,
  Spinner,
  avatarTint,
  humanize,
} from "@/components/ui";

export default function DriversPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const utils = trpc.useUtils();
  const driversQuery = trpc.driver.list.useQuery();

  const createDriver = trpc.driver.create.useMutation({
    onSuccess: () => {
      utils.driver.list.invalidate(); // refetch the list automatically
      setName("");
      setPhone("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDriver.mutate({ name, phone });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "AVAILABLE":
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "BUSY":
      case "ON_DELIVERY":
      case "IDLE":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="page animate-fade-in space-y-8">
      <PageHeader
        eyebrow="Fleet"
        title="Drivers"
        description="Manage active personnel, onboarding, and availability statuses."
        action={<LivePill label="Active fleet" />}
      />

      {/* Add driver */}
      <section className="card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-foreground">Add a driver</h2>
          <p className="mt-0.5 text-sm text-muted">
            New drivers become available for dispatch immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full flex-1">
            <label htmlFor="driver-name" className="label">
              Driver name
            </label>
            <input
              id="driver-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="input"
              required
            />
          </div>

          <div className="w-full flex-1">
            <label htmlFor="driver-phone" className="label">
              Phone number
            </label>
            <input
              id="driver-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 019-2834"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={createDriver.isPending}
            className="btn btn-primary w-full sm:w-auto"
          >
            {createDriver.isPending ? (
              <>
                <Spinner />
                Adding…
              </>
            ) : (
              <>
                <Icons.Plus className="h-4 w-4" />
                Add driver
              </>
            )}
          </button>
        </form>

        {createDriver.error && (
          <div className="mt-4">
            <ErrorAlert message={createDriver.error.message} />
          </div>
        )}
      </section>

      {/* Roster */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="section-label">Registered drivers</h2>
          <CountChip count={driversQuery.data?.length || 0} />
        </div>

        {driversQuery.isLoading && <ListSkeleton />}

        {!driversQuery.isLoading && driversQuery.data?.length === 0 && (
          <EmptyState
            icon={<Icons.Drivers className="h-5 w-5" />}
            title="No drivers registered yet"
            description="Add your first driver above to start dispatching deliveries."
          />
        )}

        {!!driversQuery.data?.length && (
          <ul className="card divide-y divide-line overflow-hidden">
            {driversQuery.data.map((driver) => (
              <li
                key={driver.id}
                className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-surface-muted sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`avatar ${avatarTint(driver.name ?? "D")}`}>
                    {driver.name?.[0]?.toUpperCase() || "D"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {driver.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-muted">
                      <Icons.Phone className="h-3.5 w-3.5 shrink-0 text-subtle" />
                      <span className="truncate">{driver.phone}</span>
                    </p>
                  </div>
                </div>

                <span className={`badge ${getStatusBadge(driver.status)}`}>
                  <span className="badge-dot" />
                  {humanize(driver.status || "AVAILABLE")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
