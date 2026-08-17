import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["DISPATCHER", "FLEET_MANAGER"]),
});

export const acceptInviteSchema = z.object({
  token: z.string(),
  name: z.string().min(1, "Your name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});