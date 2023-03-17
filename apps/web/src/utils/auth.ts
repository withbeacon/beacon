import { getServerSession } from "@beacon/auth";
import { redirect } from "next/navigation";
import { prisma } from "@beacon/db";

export async function protect() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  const waitlist = await prisma.waitlist.findUnique({
    where: { email: session.user?.email || undefined },
    select: { isApproved: true },
  });

  if (!waitlist?.isApproved) {
    redirect("/sign-in?error=access_denied");
  }
}

