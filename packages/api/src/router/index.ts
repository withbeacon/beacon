import { t } from "../trpc";
import { websiteRouter } from "./website";
import { userRouter } from "./user";

export const appRouter = t.router({
  website: websiteRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
