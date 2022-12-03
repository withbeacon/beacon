import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "@bud/auth";

import { getServerSession } from "@bud/auth";
import { prisma } from "@bud/db";

/**
 * session does not work quite yet, but will be fixed later on..
 * userId is just a dirty quick workaround for getting userId as
 * session callback didn't seem to be quite working in nextauth
 */
type CreateContextOptions = {
  session: Session | null;
  userId: string | null;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    userId: opts.userId,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    select: {
      id: true,
    },
  });

  const userId = user?.id || null;

  return await createContextInner({
    session,
    userId,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
