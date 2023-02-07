import { prisma } from "@beacon/db";
import { differencePercentage } from "@beacon/basics";

interface Params {
  id: string;
  from: Date;
  to: Date;
}

export interface Insights {
  pageViews: number;
  sessions: number;
  avgDuration: number;
  growth: {
    pageViews: number;
    sessions: number;
  };
}

export async function getInsights({ id, from, to }: Params): Promise<Insights> {
  const sessions = await prisma.userSession.count({
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

  const pageViews = await prisma.pageView.count({
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

  const {
    _avg: { visitDuration: avgDuration },
  } = await prisma.pageView.aggregate({
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

  const previousPeriod = {
    from: new Date(from.getTime() - (to.getTime() - from.getTime())),
    to: from,
  };

  const previousSessions = await prisma.userSession.count({
    where: {
      website: {
        id,
      },

      createdAt: {
        gte: previousPeriod.from,
        lte: previousPeriod.to,
      },
    },
  });

  const previousPageViews = await prisma.pageView.count({
    where: {
      website: {
        id,
      },

      createdAt: {
        gte: previousPeriod.from,
        lte: previousPeriod.to,
      },
    },
  });

  const growth = {
    pageViews: differencePercentage(pageViews, previousPageViews),
    sessions: differencePercentage(sessions, previousSessions),
  };

  return {
    pageViews,
    sessions,
    growth,
    avgDuration: avgDuration ?? 0,
  };
}
