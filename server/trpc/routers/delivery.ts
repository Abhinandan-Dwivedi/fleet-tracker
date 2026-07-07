import { router, staffProcedure, publicProcedure } from "../trpc";
import {
  createDeliverySchema,
  assignDeliverySchema,
  updateDeliveryStatusSchema,
} from "@/server/schemas/delivery";
import { assertValidTransition } from "@/server/services/deliveryStateMachine";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const deliveryRouter = router({
  list: staffProcedure.query(async ({ ctx }) => {
    return ctx.prisma.delivery.findMany({
      where: { companyId: ctx.session.user.companyId },
      include: { driver: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: staffProcedure
    .input(createDeliverySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.delivery.create({
        data: {
          ...input,
          companyId: ctx.session.user.companyId,
          status: "PENDING",
        },
      });
    }),

  assign: staffProcedure
    .input(assignDeliverySchema)
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.prisma.delivery.findFirst({
        where: { id: input.deliveryId, companyId: ctx.session.user.companyId },
      });

      if (!delivery) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      assertValidTransition(delivery.status, "ASSIGNED");

      return ctx.prisma.delivery.update({
        where: { id: input.deliveryId },
        data: {
          driverId: input.driverId,
          status: "ASSIGNED",
        },
      });
    }),

  updateStatus: staffProcedure
    .input(updateDeliveryStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.prisma.delivery.findFirst({
        where: { id: input.deliveryId, companyId: ctx.session.user.companyId },
      });

      if (!delivery) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      assertValidTransition(delivery.status, input.status);

      return ctx.prisma.delivery.update({
        where: { id: input.deliveryId },
        data: { status: input.status },
      });
    }),

   
  getByTrackingToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const delivery = await ctx.prisma.delivery.findUnique({
        where: { trackingToken: input.token },
        select: {
          status: true,
          pickupAddress: true,
          dropoffAddress: true,
          estimatedArrival: true,
          createdAt: true,
          
        },
      });

      if (!delivery) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return delivery;
    }),
});