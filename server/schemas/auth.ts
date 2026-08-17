import { z } from "zod";

export const signupSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  name: z.string().min(1, "Your name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});