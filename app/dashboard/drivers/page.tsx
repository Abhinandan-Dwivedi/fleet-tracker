"use client";

import { trpc } from "@/lib/trpc";
import { useState } from "react";

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

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Drivers</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Driver name"
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <button
          type="submit"
          disabled={createDriver.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createDriver.isPending ? "Adding..." : "Add Driver"}
        </button>
      </form>

      {!driversQuery.isLoading && driversQuery.data?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No drivers yet — add your first driver above.</p>
        </div>
      )}

      <ul className="space-y-2">
        {driversQuery.data?.map((driver) => (
          <li key={driver.id} className="border rounded p-3 flex justify-between">
            <span>{driver.name} — {driver.phone}</span>
            <span className="text-sm text-gray-500">{driver.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}