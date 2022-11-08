import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@spark/db";
import { getSession } from "~/utils";
import cuid from "cuid";

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
  events?: Events;
};

type KeyValuePairs = {
  [key: string]: string;
};

type Events = {
  [key: string]: {
    [key: string]: boolean;
  };
};

type QueryParams = KeyValuePairs;

function isExpired(expiredDate: Date) {
  return new Date() > expiredDate;
}

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

  const {
    websiteId,
    url,
    visitTime,
    referrer,
    title,
    events,
    ...body
  }: BodyParams = JSON.parse(req.body);

  if (!websiteId) {
    return res.status(400).json("Missing data in the body");
  }

  let { hostname: host, pathname } = new URL(url);
  pathname = pathname.replace("/", "");

  const queryParams: QueryParams = Object.fromEntries(new URLSearchParams(pathname));
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

  if (session && isExpired(session.expires)) {
    // remove the fingerprint when the session is expired after 24 hours
    // but still be able to get information about the session this way we don't
    // have anything specific to the user but completely anonymous history
    await prisma.userSession.update({
      where: {
        id: sessionId,
      },
      data: {
        id: cuid(),
      },
    });
  }

  if (session === null || isExpired(session.expires)) {
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

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
        queryParams,
        events,
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
      queryParams,
      bounced: visitTime < 10 * 1000,
      visitDuration: visitTime < 10 * 1000 ? null : visitTime,
      name: title,
      events,
    },
  });

  res.json({ message: "Ok" });
  return;
}
