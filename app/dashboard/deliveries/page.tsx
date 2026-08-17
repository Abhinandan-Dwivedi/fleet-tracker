"use client";

import { trpc } from "@/lib/trpc";
import { useState } from "react";

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
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "ASSIGNED":
      case "IN_TRANSIT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Delivery Operations
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatch, track, and assign fleet drivers to active orders.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Dispatch
          </span>
        </div>

        {/* Compact Dispatch Form Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              New Dispatch Request
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Pickup Address
                </label>
                <input
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="131 Sonepat"
                  className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-2 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Dropoff Address
                </label>
                <input
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen"
                  className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-2 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Customer Name
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kundan Dwivedi"
                  className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-2 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Contact Phone
                </label>
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 8485012834"
                  className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-xs rounded-lg px-3 py-2 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={createDelivery.isPending}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-5 rounded-lg disabled:opacity-50 transition-all text-xs shadow-sm flex items-center justify-center gap-2"
              >
                {createDelivery.isPending ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>+ Create Delivery</span>
                )}
              </button>
            </div>
          </form>

          {createDelivery.error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200/80 text-red-600 text-xs mt-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{createDelivery.error.message}</span>
            </div>
          )}
        </div>

        {/* Deliveries Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Deliveries ({deliveriesQuery.data?.length || 0})
            </h2>
          </div>

          {!deliveriesQuery.isLoading && deliveriesQuery.data?.length === 0 && (
            <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-xl shadow-sm">
              <p className="text-xs font-medium text-slate-500">No active deliveries</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {deliveriesQuery.data?.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-xs shrink-0 border border-slate-200/60">
                      {delivery.customerName?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {delivery.customerName}
                      </h3>
                      {delivery.customerPhone && (
                        <p className="text-xs text-slate-400">
                          {delivery.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border self-start sm:self-auto ${getStatusBadge(
                      delivery.status
                    )}`}
                  >
                    {delivery.status}
                  </span>
                </div>

                {/* Route Visualizer */}
                <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-slate-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Pickup
                      </p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {delivery.pickupAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-slate-900 mt-1 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Dropoff
                      </p>
                      <p className="text-slate-800 font-medium mt-0.5">
                        {delivery.dropoffAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Driver Assignment Toolbar */}
                {delivery.status === "PENDING" && (
                  <div className="mt-1 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 shrink-0">
                      Assign Driver:
                    </span>
                    <select
                      className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 transition-colors shrink-0 shadow-sm"
                    >
                      Assign
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}