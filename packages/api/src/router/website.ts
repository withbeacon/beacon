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

    const sessions = await ctx.prisma.userSession.count({
      where: {
        website: {
          id: input,
        },
      },
    });

    const pageViews = await ctx.prisma.pageView.count({
      where: {
        website: {
          id: input,
        },
      },
    });

    if (!website) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Website not found",
      });
    }

    // get average duration of all visits of all pages
    const avgDuration = await ctx.prisma.pageView.aggregate({
      where: {
        website: {
          id: input,
        },
      },

      _avg: {
        visitDuration: true,
      },
    });

    return {
      sessions: sessions,
      pageViews: pageViews,
      avgDuration: avgDuration._avg.visitDuration,
      ...website,
    };
  }),

  // return the sessions by the website id and between provided time
  // if no time is provided, return this week's sessions
  sessions: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const sessions = await ctx.prisma.userSession.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          id: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return sessions;
    }),

  pageViews: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      if (!from) {
        const date = new Date();

        date.setDate(date.getDate() - 7);
        from = date;
      }

      if (!to) {
        to = new Date();
      }

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      // get number of sessions happend by each between the given time period
      const pageViews = await ctx.prisma.pageView.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          id: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return pageViews;
    }),

  pages: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      if (!from) {
        const date = new Date();

        date.setDate(date.getDate() - 7);
        from = date;
      }

      if (!to) {
        to = new Date();
      }

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const group = await ctx.prisma.pageView.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          url: true,
        },
      });

      let views: Record<string, number> = {};

      for (let item of group) {
        item.url = new URL(item.url).pathname;
        item.url in views ? views[item.url]++ : (views[item.url] = 1);
      }

      return views;
    }),

  sources: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        utmParam: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to, utmParam } = input;

      if (!from) {
        const date = new Date();

        date.setDate(date.getDate() - 7);
        from = date;
      }

      if (!to) {
        to = new Date();
      }

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const group = await ctx.prisma.pageView.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          queryParams: true,
        },
      });

      let params: Record<string, number> = {};

      for (const page of group) {
        const { queryParams } = page;

        if (queryParams === null) {
          return;
        }

        Object.entries(queryParams).forEach(([param, value]) => {
          if (param === utmParam) {
            !params[value] ? (params[value] = 1) : (params[value] += 1);
          }
        });
      }

      return params || {};
    }),

  events: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      if (!from) {
        const date = new Date();

        date.setDate(date.getDate() - 7);
        from = date;
      }

      if (!to) {
        to = new Date();
      }

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const group = await ctx.prisma.pageView.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          events: true,
        },
      });

      let evts: Record<string, { eventType: string; times: number }> = {};

      for (const page of group) {
        const { events } = page;

        if (events === null || typeof events !== "object") {
          break;
        }

        Object.entries(events).forEach(([key, value]) => {
          if (!value || typeof value !== "object") {
            return;
          }

          const times = (evts[key]?.times || 0) + 1;

          evts[key] = {
            eventType: Object.keys(value)[0] as string,
            times,
          };
        });
      }

      return evts || {};
    }),

  countries: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      if (!from) {
        const date = new Date();

        date.setDate(date.getDate() - 7);
        from = date;
      }

      if (!to) {
        to = new Date();
      }

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const group = await ctx.prisma.userSession.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          country: true,
        },
      });

      let countries: Record<string, number> = {};

      for (const page of group) {
        const { country } = page;

        if (country === null) {
          return;
        }

        !countries[country]
          ? (countries[country] = 1)
          : (countries[country] += 1);
      }

      return countries || {};
    }),

  browsers: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      if (!from) {
        const date = new Date();

        date.setDate(date.getDate() - 7);
        from = date;
      }

      if (!to) {
        to = new Date();
      }

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const group = await ctx.prisma.userSession.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          browser: true,
        },
      });

      let browsers: Record<string, number> = {};

      for (const page of group) {
        const { browser } = page;

        if (browser === null) {
          return;
        }

        !browsers[browser] ? (browsers[browser] = 1) : (browsers[browser] += 1);
      }

      return browsers || {};
    }),

  devices: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date().optional(),
        to: z.date().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      let { from, to } = input;

      if (!from) {
        const date = new Date();

        date.setDate(date.getDate() - 7);
        from = date;
      }

      if (!to) {
        to = new Date();
      }

      const website = await ctx.prisma.website.findUnique({
        where: {
          id: websiteId,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      const group = await ctx.prisma.userSession.findMany({
        where: {
          website: {
            id: websiteId,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },

        select: {
          device: true,
        },
      });

      let devices: Record<string, number> = {};

      for (const page of group) {
        const { device } = page;

        if (device === null) {
          return;
        }

        !devices[device] ? (devices[device] = 1) : (devices[device] += 1);
      }

      return devices || {};
    }),
});
