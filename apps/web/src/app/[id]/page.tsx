import { SessionInsights, PageViewInsights, TimeInsights } from "~/components/insights";
import { Suspense } from "react";
import Metrics from "~/components/metrics";

import { getServerSession } from "@beacon/auth";
import { getMetrics, getInsights } from "~/utils/db";
import { notFound } from "next/navigation";
import { prisma } from "@beacon/db";
import { fromNow } from "@beacon/basics";

interface Props {
  params: { id: string };
  searchParams: {
    from: string | number | undefined;
    to: string | number | undefined;
  };
}

export default async function Page({
  params: { id },
  searchParams: { from, to },
}: Props) {
  id = id.replace("%3A", ":");

  const website = await prisma.website.findUnique({
    where: {
      id,
    },
  });

  if (!website) {
    notFound();
  }

  const session = await getServerSession();

  if (!session && !website.public) {
    notFound();
  }

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
      select: {
        id: true,
      },
    });

    if (website?.userId !== user?.id) {
      notFound();
    }
  }
if (!from) { from = +fromNow(7);
  } else {
    from = +from;
  }

  if (!to) {
    to = +new Date();
  } else {
    to = +to;
  }

  const metrics = await getMetrics({
    id,
    from: new Date(from),
    to: new Date(to),
  });

  const insights = await getInsights({
    id,
    from: new Date(from),
    to: new Date(to),
  });

  return (
    <div className="m-6 flex flex-col gap-6">
      <div className="flex gap-4">
        <SessionInsights
          data={metrics.sessions}
          value={insights.sessions}
          timeFormat={metrics.timeFormat}
        />
        <PageViewInsights
          data={metrics.pageViews}
          value={insights.pageViews}
          timeFormat={metrics.timeFormat}
        />
      </div>
      <Metrics data={metrics} />
    </div>
  );
}
