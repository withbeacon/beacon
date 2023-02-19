import { prisma } from "@beacon/db";

// Get the date on which the first page view was recorded for the given site.
// To be used for the date picker component
export async function getMinDate(id: string): Promise<Date | null> {
  const minDate = await prisma.pageView.findFirst({
    where: { websiteId: id },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  return minDate?.createdAt ?? null;
}

