import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { load } from "cheerio";

export const websiteRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { url } = input;

      async function getFavicon(): Promise<string | null> {
        const paths = ["/favicon.svg", "/favicon.ico", "/favicon.png"];

        for (const path of paths) {
          const faviconUrl = `https://${url}${path}`;
          const resp = await fetch(faviconUrl);

          if (resp.status === 200) {
            return faviconUrl;
          }
        }

        return null;
      }

      async function getTitle(): Promise<string> {
        const resp = await fetch("https://" + url);
        const html = await resp.text();
        const $ = load(html);

        let title = $("title").text();

        // remove all the seperators
        let [name, _] = title.split(/[-|:|−|–]/);

        if (!name) {
          return `${ctx.session.user?.name}'s website`;
        }

        return name.trim();
      }

      const favicon = await getFavicon();
      const name = await getTitle();

      try {
        return await ctx.prisma.website.create({
          data: {
            url,
            name,
            favicon,
            user: {
              connect: {
                id: ctx.userId,
              },
            },
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Website already exists",
            });
          }
        }
      }
    }),
});
