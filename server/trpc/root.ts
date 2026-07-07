import { router } from "./trpc";
import { driverRouter } from "./routers/driver";
import { deliveryRouter } from "./routers/delivery";

export const appRouter = router({
  driver: driverRouter,
  delivery: deliveryRouter,
});

export type AppRouter = typeof appRouter;