import { SessionInsights, PageViewInsights } from "~/components/insights";
import Metrics from "~/components/metrics";
import AnalyticsSidebar from "~/components/analyticsSidebar";
import StoreInitializer from "~/components/storeInitializer";

import useWebsiteStore from "~/store/website";
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

  if (!from) {
    from = +fromNow(7);
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

  const defaultState = {
    name: website.name,
    url: website.url,
    public: website.public,
    pageViews: insights.pageViews,
    sessions: insights.sessions,
    createdAt: website.createdAt,
    metrics,
  } as const;

  useWebsiteStore.setState({ ...defaultState });

  return (
    <div className="flex flex-col gap-6 overflow-scroll p-6 pr-2 lg:flex-row">
      <StoreInitializer {...defaultState} />
      <AnalyticsSidebar isAuthed={!!session} />

      <main className="ml-0 flex w-full flex-col gap-6 overflow-scroll lg:ml-64">
        <div className="hide-scrollbar flex gap-4 overflow-scroll lg:overflow-hidden">
          <SessionInsights />
          <PageViewInsights />
        </div>

        <Metrics />
      </main>
    </div>
  );
}
