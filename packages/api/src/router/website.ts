import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

import {
  getDaysBetween,
  getWeeksBetween,
  getMonthsBetween,
  getDateFormat,
  addDays,
  addWeeks,
  addMonths,
  toDay,
  toWeek,
  toMonth,
} from "@bud/basics";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { getFavicon } from "../utils";
import { z } from "zod";

export const websiteRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, url } = input;
      const { userId } = ctx;

      if (url.includes("/") || (!url.includes(".") && !url.includes(":"))) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or malformed URL",
        });
      }

      try {
        const favicon = await getFavicon("https://" + url);

        await ctx.prisma.website.create({
          data: {
            id: url,
            name,
            url,
            userId,
            favicon,
          },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Whoops, website already exists",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, something went wrong at our end. Please create a issue on github if it persists.",
          cause: err,
        });
      }

      return {
        success: true,
      };
    }),

  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.website.findMany({
      where: {
        user: { id: ctx.userId },
      },
    });
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        from: z.date(),
        to: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, from, to } = input;
      const { userId } = ctx;

      const website = await ctx.prisma.website.findUnique({
        where: {
          id,
        },
      });

      if (!website) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Website not found",
        });
      }

      if (!website.public && website.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this website",
        });
      }

      const sessions = await ctx.prisma.userSession.count({
        where: {
          website: {
            id,
          },

          createdAt: {
            gte: from,
            lte: to,
          },
        },
      });

      const pageViews = await ctx.prisma.pageView.count({
        where: {
          website: {
            id,
          },

          createdAt: {
            gte: from,
            lte: to,
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
            id,
          },

          createdAt: {
            gte: from,
            lte: to,
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

  metrics: publicProcedure
    .input(
      z.object({
        websiteId: z.string(),
        from: z.date(),
        to: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { websiteId } = input;
      const { userId } = ctx;
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

      if (!website.public && website.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this website",
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
          device: true,
          browser: true,
          country: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

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
          events: true,
          url: true,
          queryParams: true,
        },
      });

      let devices: Record<string, number> = {};
      let browsers: Record<string, number> = {};
      let countries: Record<string, number> = {};
      let pages: Record<string, number> = {};
      let events: Record<string, number> = {};
      let queryParams: Record<string, Record<string, number>> = {};

      sessions.forEach((session) => {
        const { device, browser, country } = session;

        if (device) {
          devices[device] ? (devices[device] += 1) : (devices[device] = 1);
        }

        if (browser) {
          browsers[browser]
            ? (browsers[browser] += 1)
            : (browsers[browser] = 1);
        }

        if (country) {
          countries[country]
            ? (countries[country] += 1)
            : (countries[country] = 1);
        }
      });

      pageViews.forEach((pageView) => {
        const { queryParams: params, events: pageEvents } = pageView;
        const url = new URL(pageView.url).pathname;

        if (url) {
          pages[url] ? (pages[url] += 1) : (pages[url] = 1);
        }

        if (typeof pageEvents === "object" && pageEvents !== null) {
          Object.keys(pageEvents).forEach((event) => {
            events[event] ? (events[event] += 1) : (events[event] = 1);
          });
        }

        if (typeof params === "object" && params !== null) {
          Object.entries(params).forEach(([param, val]) => {
            if (val && typeof val === "string") {
              queryParams[param] = queryParams[param] || {};

              // avoid typechecking the following line as it just works, maybe
              // will look for better solution later..
              // @ts-ignore
              queryParams[param][val] = queryParams[param][val] + 1 || 1;
            }
          });
        }
      });

      const format = getDateFormat(from);
      let sessionMetrics: Record<number | string, number> = {};
      let pageViewMetrics: Record<number | string, number> = {};

      switch (format) {
        case "daily": {
          const days = getDaysBetween(from, to);

          for (let i = 0; i < days; i++) {
            const date = addDays(from, i);

            sessionMetrics[date.getTime()] = 0;
            pageViewMetrics[date.getTime()] = 0;
          }

          sessions.forEach((session) => {
            const date = toDay(session.createdAt);

            if (!sessionMetrics[date.getTime()]) {
              sessionMetrics[date.getTime()] = 0;
            }

            sessionMetrics[date.getTime()] += 1;
          });

          pageViews.forEach((pageView) => {
            const date = toDay(pageView.createdAt);

            if (!pageViewMetrics[date.getTime()]) {
              pageViewMetrics[date.getTime()] = 0;
            }

            pageViewMetrics[date.getTime()] += 1;
          });

          break;
        }

        case "weekly": {
          const weeks = getWeeksBetween(from, to);

          for (let i = 0; i < weeks; i++) {
            const date = addWeeks(from, i);

            sessionMetrics[date.getTime()] = 0;
            pageViewMetrics[date.getTime()] = 0;
          }

          sessions.forEach((session) => {
            const date = toWeek(session.createdAt);

            if (sessionMetrics[date.getTime()]) {
              sessionMetrics[date.getTime()] += 1;
            }

            sessionMetrics[date.getTime()] = 0;
          });

          pageViews.forEach((pageView) => {
            const date = toWeek(pageView.createdAt);

            if (!pageViewMetrics[date.getTime()]) {
              pageViewMetrics[date.getTime()] = 0;
            }

            pageViewMetrics[date.getTime()] += 1;
          });

          break;
        }

        case "monthly": {
          const months = getMonthsBetween(from, to);

          for (let i = 0; i < months; i++) {
            const date = addMonths(from, i);

            sessionMetrics[date.getTime()] = 0;
            pageViewMetrics[date.getTime()] = 0;
          }

          sessions.forEach((session) => {
            const date = toMonth(session.createdAt);

            if (sessionMetrics[date.getTime()]) {
              sessionMetrics[date.getTime()] += 1;
            }

            sessionMetrics[date.getTime()] = 0;
          });

          pageViews.forEach((pageView) => {
            const date = toMonth(pageView.createdAt);

            if (!pageViewMetrics[date.getTime()]) {
              pageViewMetrics[date.getTime()] = 0;
            }

            pageViewMetrics[date.getTime()] += 1;
          });

          break;
        }
      }

      return {
        devices,
        browsers,
        countries,
        pages,
        events,
        queryParams,
        sessions: sessionMetrics,
        pageViews: pageViewMetrics,
        timeFormat: format,
      };
    }),
});
