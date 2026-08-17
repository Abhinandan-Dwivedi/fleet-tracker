import { router } from "./trpc";
import { driverRouter } from "./routers/driver";
import { deliveryRouter } from "./routers/delivery";
import { authRouter } from "./routers/auth";
import { inviteRouter } from "./routers/invite";


export const appRouter = router({
  driver: driverRouter,
  delivery: deliveryRouter,
  auth: authRouter,
  invite: inviteRouter,
});

export type AppRouter = typeof appRouter;