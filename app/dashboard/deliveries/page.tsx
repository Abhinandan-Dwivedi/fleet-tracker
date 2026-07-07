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

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Deliveries</h1>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-2 gap-2">
        <input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Pickup address" className="border rounded px-3 py-2" required />
        <input value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} placeholder="Dropoff address" className="border rounded px-3 py-2" required />
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" className="border rounded px-3 py-2" required />
        <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Customer phone" className="border rounded px-3 py-2" required />
        <button type="submit" disabled={createDelivery.isPending} className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {createDelivery.isPending ? "Creating..." : "Create Delivery"}
        </button>
      </form>

      {createDelivery.error && (
        <p className="text-red-500 mb-4">{createDelivery.error.message}</p>
      )}

      {!deliveriesQuery.isLoading && deliveriesQuery.data?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No deliveries yet — create your first one above.</p>
        </div>
      )}
      <div className="space-y-3">
        {deliveriesQuery.data?.map((delivery) => (
          <div key={delivery.id} className="border rounded p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{delivery.customerName}</p>
                <p className="text-sm text-gray-500">
                  {delivery.pickupAddress} → {delivery.dropoffAddress}
                </p>
              </div>
              <span className="text-sm font-medium px-2 py-1 rounded bg-gray-100">
                {delivery.status}
              </span>
            </div>

            {delivery.status === "PENDING" && (
              <div className="mt-3 flex gap-2 items-center">
                <select
                  className="border rounded px-2 py-1 text-sm"
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
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Assign
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}