import Sidebar from "~/components/sidebar";
import BottomNav from "~/components/bottomNav";
import Header from "~/components/header";

import { getServerSession } from "@beacon/auth";
import { redirect } from "next/navigation";
import { protect } from "~/utils/auth";
import { prisma } from "@beacon/db";

export default async function Page() {
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
      </main>
    </div>
  );
}
