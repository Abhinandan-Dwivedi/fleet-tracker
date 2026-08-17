import { router, publicProcedure } from "../trpc";
import { signupSchema } from "@/server/schemas/auth";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      // create Company + first User together, atomically
      await ctx.prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: { name: input.companyName },
        });

        await tx.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            name: input.name,
            role: "FLEET_MANAGER",
            companyId: company.id,
          },
        });
      });

      return { success: true };
    }),
});