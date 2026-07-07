import { router, staffProcedure } from "../trpc";
import { createDriverSchema } from "@/server/schemas/driver";
import { pusherServer } from "@/lib/pusher-server";
import { z } from "zod";

export const driverRouter = router({
  list: staffProcedure.query(async ({ ctx }) => {
    return ctx.prisma.driver.findMany({
      where: { companyId: ctx.session.user.companyId },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: staffProcedure
    .input(createDriverSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.driver.create({
        data: {
          name: input.name,
          phone: input.phone,
          companyId: ctx.session.user.companyId,
        },
      });
    }),

  getById: staffProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.driver.findFirst({
        where: { id: input.id, companyId: ctx.session.user.companyId },
        include: { vehicle: true, deliveries: true },
      });
    }),

  updateLocation: staffProcedure
    .input(
      z.object({
        driverId: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.prisma.driver.findFirst({
        where: { id: input.driverId, companyId: ctx.session.user.companyId },
      });

      if (!driver) {
        throw new Error("Driver not found");
      }

      // write to history for audit trail
      await ctx.prisma.locationHistory.create({
        data: {
          driverId: input.driverId,
          latitude: input.latitude,
          longitude: input.longitude,
        },
      });

      // mark driver as active if they weren't
      await ctx.prisma.driver.update({
        where: { id: input.driverId },
        data: { status: "ACTIVE" },
      });

      // fan out to all dispatchers watching this company's map
      await pusherServer.trigger(
        `company-${ctx.session.user.companyId}`,
        "location-update",
        {
          driverId: input.driverId,
          latitude: input.latitude,
          longitude: input.longitude,
        }
      );

      return { success: true };
    }),
});