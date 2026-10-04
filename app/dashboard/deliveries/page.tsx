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

export default function DeliveriesPage() {
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const utils = trpc.useUtils();
  const deliveriesQuery = trpc.delivery.list.useQuery();
  const driversQuery = trpc.driver.list.useQuery();

  const createDelivery = trpc.delivery.create.useMutation({
    onSuccess: () => {
      utils.delivery.list.invalidate();
      setPickupAddress("");
      setDropoffAddress("");
      setCustomerName("");
      setCustomerPhone("");
    },
  });

  const assignDelivery = trpc.delivery.assign.useMutation({
    onSuccess: () => {
      utils.delivery.list.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDelivery.mutate({
      pickupAddress,
      dropoffAddress,
      customerName,
      customerPhone,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "ASSIGNED":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "IN_TRANSIT":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "FAILED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="page animate-fade-in space-y-8">
      <PageHeader
        eyebrow="Dispatch"
        title="Deliveries"
        description="Dispatch, track, and assign fleet drivers to active orders."
        action={<LivePill label="Live dispatch" />}
      />

      {/* New dispatch request */}
      <section className="card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-foreground">New dispatch request</h2>
          <p className="mt-0.5 text-sm text-muted">
            Create a delivery, then assign it to an available driver below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pickup" className="label">
                Pickup address
              </label>
              <input
                id="pickup"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="131 Sonepat"
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="dropoff" className="label">
                Dropoff address
              </label>
              <input
                id="dropoff"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="e.g. 742 Evergreen"
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="customer-name" className="label">
                Customer name
              </label>
              <input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Kundan Dwivedi"
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="customer-phone" className="label">
                Contact phone
              </label>
              <input
                id="customer-phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +91 8485012834"
                className="input"
                required
              />
            </div>
          </div>

          {createDelivery.error && <ErrorAlert message={createDelivery.error.message} />}

          <div className="flex justify-end border-t border-line pt-5">
            <button
              type="submit"
              disabled={createDelivery.isPending}
              className="btn btn-primary w-full sm:w-auto"
            >
              {createDelivery.isPending ? (
                <>
                  <Spinner />
                  Creating…
                </>
              ) : (
                <>
                  <Icons.Plus className="h-4 w-4" />
                  Create delivery
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Deliveries feed */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="section-label">Active deliveries</h2>
          <CountChip count={deliveriesQuery.data?.length || 0} />
        </div>

        {deliveriesQuery.isLoading && <ListSkeleton />}

        {!deliveriesQuery.isLoading && deliveriesQuery.data?.length === 0 && (
          <EmptyState
            icon={<Icons.Package className="h-5 w-5" />}
            title="No active deliveries"
            description="New dispatch requests you create will appear here."
          />
        )}

        <div className="grid grid-cols-1 gap-4">
          {deliveriesQuery.data?.map((delivery) => (
            <article key={delivery.id} className="card card-interactive overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`avatar ${avatarTint(delivery.customerName ?? "C")}`}>
                    {delivery.customerName?.[0]?.toUpperCase() || "C"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {delivery.customerName}
                    </h3>
                    {delivery.customerPhone && (
                      <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-muted">
                        <Icons.Phone className="h-3.5 w-3.5 shrink-0 text-subtle" />
                        <span className="truncate">{delivery.customerPhone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <span className={`badge ${getStatusBadge(delivery.status)}`}>
                  <span className="badge-dot" />
                  {humanize(delivery.status)}
                </span>
              </div>

              {/* Route */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <ol className="relative grid gap-3 rounded-lg border border-line bg-surface-muted p-3.5 md:grid-cols-2 md:gap-6">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 border-slate-400 bg-surface" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
                        Pickup
                      </p>
                      <p className="mt-0.5 break-words text-sm font-medium text-foreground">
                        {delivery.pickupAddress}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-brand ring-4 ring-brand/15" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">
                        Dropoff
                      </p>
                      <p className="mt-0.5 break-words text-sm font-medium text-foreground">
                        {delivery.dropoffAddress}
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Assigned driver */}
              {delivery.driver && (
                <div className="flex items-center gap-2 border-t border-line bg-surface-muted/60 px-4 py-3 text-sm text-muted sm:px-5">
                  <Icons.Truck className="h-4 w-4 text-subtle" />
                  Driver
                  <span className="font-medium text-foreground">{delivery.driver.name}</span>
                </div>
              )}

              {/* Driver assignment toolbar */}
              {delivery.status === "PENDING" && (
                <div className="flex flex-col gap-2 border-t border-line bg-surface-muted/60 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
                  <label
                    htmlFor={`driver-select-${delivery.id}`}
                    className="shrink-0 text-sm font-medium text-muted"
                  >
                    Assign driver
                  </label>
                  <div className="flex flex-1 gap-2 sm:max-w-sm">
                    <select
                      className="input select btn-sm h-9 min-w-0 flex-1"
                      id={`driver-select-${delivery.id}`}
                    >
                      <option value="">Select driver...</option>
                      {driversQuery.data?.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const select = document.getElementById(
                          `driver-select-${delivery.id}`
                        ) as HTMLSelectElement;
                        if (select.value) {
                          assignDelivery.mutate({
                            deliveryId: delivery.id,
                            driverId: select.value,
                          });
                        }
                      }}
                      disabled={assignDelivery.isPending}
                      className="btn btn-success btn-sm"
                    >
                      {assignDelivery.isPending &&
                      assignDelivery.variables?.deliveryId === delivery.id ? (
                        <Spinner className="h-3.5 w-3.5" />
                      ) : (
                        <Icons.Check className="h-4 w-4" />
                      )}
                      Assign
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
