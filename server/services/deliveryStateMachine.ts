import { DeliveryStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const VALID_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  PENDING: ["ASSIGNED"],
  ASSIGNED: ["IN_TRANSIT", "PENDING"],
  IN_TRANSIT: ["DELIVERED", "FAILED"],
  DELIVERED: [],
  FAILED: ["PENDING"],
};

export function assertValidTransition(
  currentStatus: DeliveryStatus,
  newStatus: DeliveryStatus
) {
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed.includes(newStatus)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Cannot transition delivery from ${currentStatus} to ${newStatus}`,
    });
  }
}