import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@beacon/db";
import { isExpired } from "@beacon/basics";
import { getSession, parseAgent } from "~/utils";
import isBot from "isbot";
import cuid from "cuid";

type BodyParams = {
  url: string;
  visitTime: number;
  screen: string;
  device: string;
  userAgent: string;
  referrer: string;
  title: string;
  events?: Events;
};

type Events = Record<string, Record<string, boolean>>;
type QueryParams = Record<string, string>;

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

  if (isBot(req.headers["user-agent"])) {
    res.send("Ok");
    return;
  }

  const {
    url: href,
    visitTime,
    referrer,
    title,
    events,
    userAgent,
    ...body
  }: BodyParams = JSON.parse(req.body);

  const { origin, pathname, host, searchParams } = new URL(href);
  const url = origin + pathname;
  const queryParams: QueryParams = Object.fromEntries(searchParams);

  const sessionId = getSession(req, host);

  const website = await prisma.website.findFirst({
    where: {
      id: host,
    },
  });

  const { os, browser, device } = parseAgent(userAgent);

  if (website === null) {
    res
      .status(404)
      .json({ error: "Website not found. Please add it to your account." });

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
        ...body,
        id: sessionId,
        os,
        browser,
        device,
        expires,
        website: {
          connect: {
            id: website?.id,
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
        website: {
          connect: {
            id: website.id,
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

