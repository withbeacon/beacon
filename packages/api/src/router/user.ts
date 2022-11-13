import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getId: protectedProcedure.query(({ ctx }) => {
    return ctx.userId;
  }),
});
