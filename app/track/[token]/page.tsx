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
    PENDING: "bg-gray-100 text-gray-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_TRANSIT: "bg-yellow-100 text-yellow-700",
    DELIVERED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-xl font-bold mb-1">Track Your Delivery</h1>
        <p className="text-sm text-gray-500 mb-6">
          Order placed {new Date(delivery.createdAt).toLocaleDateString()}
        </p>

        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${statusColors[delivery.status]}`}>
          {statusLabels[delivery.status]}
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">Pickup</p>
            <p className="font-medium">{delivery.pickupAddress}</p>
          </div>
          <div>
            <p className="text-gray-500">Delivering to</p>
            <p className="font-medium">{delivery.dropoffAddress}</p>
          </div>
          {delivery.estimatedArrival && (
            <div>
              <p className="text-gray-500">Estimated arrival</p>
              <p className="font-medium">
                {new Date(delivery.estimatedArrival).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}