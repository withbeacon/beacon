import Sidebar from "~/components/sidebar";
import BottomNav from "~/components/bottomNav";
import Header from "~/components/header";
import WebsiteCard, { WebsiteCardShimmer } from "~/components/websiteCard";
import { Suspense } from "react";

import { getServerSession } from "@beacon/auth";
import { redirect } from "next/navigation";
import { protect } from "~/utils/auth";
import { prisma } from "@beacon/db";
import { date, fromNow } from "@beacon/basics";

interface Props {
  searchParams?: Record<string, string | undefined>;
}

export default async function Page({ searchParams }: Props) {
  await protect();

  const session = await getServerSession();

  const query = await prisma.website.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
  });

  if (query.length === 0) {
    redirect("/add");
  }

  const recentPageViews: Record<string, number> = {};

  for (const website of query) {
    recentPageViews[website.id] = await prisma.pageView.count({
      where: {
        websiteId: website.id,
        createdAt: {
          lte: date(),
          gte: fromNow(1),
        },
      },
    });
  }

  const search = searchParams?.search
    ?.toLowerCase()
    .trim()
    .replace("%20", " ")
    .replace("%2F", "/");

  const filteredWebsites = query.filter((website) => {
    if (search) {
      return (
        website.name.toLowerCase().includes(search) ||
        website.url.toLowerCase().includes(search)
      );
    } else {
      return true;
    }
  });

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6 lg:flex-row">
      <Sidebar
        user={{
          name: session?.user?.name || "Cool Person",
          image: session?.user?.image,
        }}
      />
      <BottomNav />
      <main className="flex w-full flex-col gap-6">
        <Header />
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <WebsiteCardShimmer />
              <WebsiteCardShimmer />
              <WebsiteCardShimmer />
            </div>
          }
        >
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredWebsites.map((website) => (
              <WebsiteCard
                key={website.id}
                name={website.name}
                url={website.url}
                views={recentPageViews[website.id] ?? 0}
              />
            ))}
          </div>
        </Suspense>
      </main>
    </div>
  );
}
