import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export const getServerSession = async (
  ctx?:
    | {
        req: GetServerSidePropsContext["req"];
        res: GetServerSidePropsContext["res"];
      }
    | { req: NextApiRequest; res: NextApiResponse }
) => {
  if (ctx) {
    return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
  }

  return await unstable_getServerSession(authOptions);
};
