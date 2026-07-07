import { z } from "zod";

export const createDeliverySchema = z.object({
  pickupAddress: z.string().min(3, "Pickup address is required"),
  dropoffAddress: z.string().min(3, "Dropoff address is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(7, "Valid phone number is required"),
});

export const assignDeliverySchema = z.object({
  deliveryId: z.string(),
  driverId: z.string(),
});

export const updateDeliveryStatusSchema = z.object({
  deliveryId: z.string(),
  status: z.enum(["PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED", "FAILED"]),
});