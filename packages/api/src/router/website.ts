import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { router, protectedProcedure } from "../trpc";
import { load } from "cheerio";
import { z } from "zod";

export const websiteRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { url } = input;

      async function getPageDetails(): Promise<{
        name: string;
        favicon: string | null;
      }> {
        const resp = await fetch(url);
        const html = await resp.text();
        const $ = load(html);

        let favicon = $("link[rel='icon']").attr("href") || null;
        let title = $("title").text();

        // remove all the seperators
        let [name, _] = title.split(/[-|:|−|–]/);

        if (!name) {
          name = `${ctx.session.user?.name}'s website`;
        }

        name = name.trim();
        favicon = favicon ? new URL(favicon, url).href : null;
        favicon = favicon ? await imageUrl(favicon) : null;

        return { name, favicon };
      }

      async function imageUrl(url: string) {
        const resp = await fetch(url);
        const blob = await resp.blob();
        return URL.createObjectURL(blob);
      }

      const { name, favicon } = await getPageDetails();

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

  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.website.findMany({
      where: {
        user: { id: ctx.userId },
      },
    });
  }),

  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const website = await ctx.prisma.website.findUnique({
      where: {
        id: input,
      },
    });

    if (!website) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Website not found",
      });
    }

    return website;
  }),
});
