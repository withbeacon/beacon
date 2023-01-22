import { protect } from "~/utils/auth";
import { getServerSession } from "@beacon/auth";
import { prisma } from "@beacon/db";
import { redirect } from "next/navigation";

export default async function Page() {
  await protect();

  const session = await getServerSession();

  const websites = await prisma.website.count({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
  });

  if (websites === 0) {
    redirect("/onboard/add");
  }

  redirect("/");
}
