import type { Metadata } from "next";
import { SessionInsights, PageViewInsights } from "~/components/insights";
import Metrics from "~/components/metrics";
import AnalyticsSidebar from "~/components/analyticsSidebar";
import StoreInitializer from "~/components/storeInitializer";
import BottomNav from "~/components/bottomNav";

import useWebsiteStore from "~/store/website";
import { getServerSession } from "@beacon/auth";
import { getMinDate, getMetrics, getInsights } from "~/utils/db";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  params.id = params.id.replace("%3A", ":");

  const website = await prisma.website.findUnique({
    where: {
      id: params.id,
    },
    select: {
      name: true,
      url: true,
    },
  });

  if (!website) {
    return {};
  }

  return {
    title: `${website.name} – Beacon`,
    description: `Analytics for ${website.url} powered by Beacon.`,
    openGraph: {
      title: `${website.name} – Beacon`,
      description: `Analytics for ${website.url} powered by Beacon.`,
      images: [
        {
          url: `
https://og-image.vercel.app/${encodeURIComponent(
            website.name
          )}%20%E2%80%93%20Beacon.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fgithub.com%2Fwithbeacon%2Fbeacon%2Fraw%2Fmain%2Fapps%2Fweb%2Fpublic%2Fsocial.png`,
        },
      ],
    },
  };
}

export default async function Page({
  params: { id },
  searchParams: { from, to },
}: Props) {
  id = id.replace("%3A", ":");

  const [website, session] = await Promise.all([
    prisma.website.findUnique({
      where: { id },
    }),

    getServerSession(),
  ]);

  if (website === null) {
    notFound();
  }

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

  const [insights, metrics, minDate] = await Promise.all([
    getInsights({
      id,
      from: new Date(from),
      to: new Date(to),
    }),

    getMetrics({
      id,
      from: new Date(from),
      to: new Date(to),
    }),

    getMinDate(id),
  ]);

  const { createdAt, ...defaultState } = {
    name: website.name,
    url: website.url,
    public: website.public,
    pageViews: insights.pageViews,
    sessions: insights.sessions,
    createdAt: website.createdAt,
    growth: insights.growth,
    minDate: minDate ?? new Date(),
    metrics,
  } as const;

  useWebsiteStore.setState({ createdAt, ...defaultState });

  return (
    <div className="flex flex-col gap-6 overflow-scroll p-6 pr-2 lg:flex-row">
      {!!session && <BottomNav />}
      <StoreInitializer
        {...defaultState}
        createdAt={+createdAt}
        minDate={minDate ? minDate.getTime() : +new Date()}
      />
      <AnalyticsSidebar isAuthed={!!session} />

      <main className="ml-0 flex w-full flex-col gap-6 overflow-scroll lg:ml-24">
        <div className="hide-scrollbar flex gap-4 overflow-scroll lg:overflow-hidden">
          <SessionInsights />
          <PageViewInsights />
        </div>

        <Metrics />
      </main>
    </div>
  );
}
