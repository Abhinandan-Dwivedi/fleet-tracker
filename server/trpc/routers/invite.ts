import { router, fleetManagerProcedure, publicProcedure } from "../trpc";
import { createInviteSchema, acceptInviteSchema } from "@/server/schemas/invite";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const inviteRouter = router({
  create: fleetManagerProcedure
    .input(createInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This email already has an account",
        });
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

      return ctx.prisma.invite.create({
        data: {
          email: input.email,
          role: input.role,
          companyId: ctx.session.user.companyId,
          expiresAt,
        },
      });
    }),

  list: fleetManagerProcedure.query(async ({ ctx }) => {
    return ctx.prisma.invite.findMany({
      where: { companyId: ctx.session.user.companyId, accepted: false },
      orderBy: { createdAt: "desc" },
    });
  }),

  getByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const invite = await ctx.prisma.invite.findUnique({
        where: { token: input.token },
        select: {
          email: true,
          role: true,
          accepted: true,
          expiresAt: true,
          company: { select: { name: true } },
        },
      });

      if (!invite) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (invite.accepted) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This invite has already been used" });
      }

      if (invite.expiresAt < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This invite has expired" });
      }

      return invite;
    }),

  accept: publicProcedure
    .input(acceptInviteSchema)
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.invite.findUnique({
        where: { token: input.token },
      });

      if (!invite || invite.accepted || invite.expiresAt < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This invite is no longer valid" });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            email: invite.email,
            password: hashedPassword,
            name: input.name,
            role: invite.role,
            companyId: invite.companyId,
          },
        });

        await tx.invite.update({
          where: { id: invite.id },
          data: { accepted: true },
        });
      });

      return { success: true, email: invite.email };
    }),
});