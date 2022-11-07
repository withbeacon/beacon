import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@spark/db";
import { getSession } from "~/utils";

type BodyParams = {
  websiteId: string;
  url: string;
  visitTime: number; // in milliseconds
  screen: string; // screen size (width x height)
  device: string; // mobile or desktop
  os: string;
  referrer: string;
  title: string;
  browser?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Invalid method" });
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Accept", "application/json");

  const { websiteId, url, visitTime, referrer, title, ...body }: BodyParams =
    JSON.parse(req.body);

  if (!websiteId) {
    return res.status(400).json("Missing data in the body");
  }

  const host = new URL(url).hostname;
  const sessionId = getSession(req, host);

  const website = await prisma.website.findUnique({
    where: {
      id: websiteId,
    },
  });

  if (website === null) {
    res.status(404).json("Website not found");
    return;
  }

  const session = await prisma.userSession.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (session === null) {
    const expires = new Date();
    expires.setHours(expires.getHours() + 48);

    await prisma.userSession.create({
      data: {
        id: sessionId,
        ...body,
        expires,
        website: {
          connect: {
            id: websiteId,
          },
        },
      },
    });
  }

  const pageView = await prisma.pageView.findFirst({
    where: {
      session: {
        id: sessionId,
      },
      url,
    },
  });

  if (pageView === null) {
    await prisma.pageView.create({
      data: {
        session: {
          connect: {
            id: sessionId,
          },
        },
        url,
        referrer,
        bounced: visitTime < 10 * 1000,
        visitDuration: visitTime < 10 * 1000 ? null : visitTime,
        name: title,
      },
    });

    res.json({ message: "Ok" });
    return;
  }

  await prisma.pageView.update({
    where: { id: pageView.id },
    data: {
      session: {
        connect: {
          id: sessionId,
        },
      },
      bounced: visitTime < 10 * 1000,
      visitDuration: visitTime < 10 * 1000 ? null : visitTime,
      name: title,
    },
  });

  res.json({ message: "Ok" });
  return;
}
