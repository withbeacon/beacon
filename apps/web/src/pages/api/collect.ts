import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@spark/db";
import { getSession, parseAgent } from "~/utils";
import { getServerSession } from "@spark/auth";
import { load } from "cheerio";
import cuid from "cuid";

type BodyParams = {
  id: string;
  url: string;
  visitTime: number; // in milliseconds
  screen: string; // screen size (width x height)
  device: string; // mobile or desktop
  userAgent: string;
  referrer: string;
  title: string;
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
    id,
    url,
    visitTime,
    referrer,
    title,
    events,
    userAgent,
    ...body
  }: BodyParams = JSON.parse(req.body);

  if (!id) {
    return res.status(400).json("Missing data in the body");
  }

  const host = new URL(url).hostname;
  let pathname = new URL(url).pathname;
  pathname = pathname.replace("/", "");

  const queryParams: QueryParams = Object.fromEntries(
    new URLSearchParams(pathname)
  );

  const sessionId = getSession(req, host);

  let website = await prisma.website.findFirst({
    where: {
      user: { id },
      url: host,
    },
  });

  const auth = await getServerSession({ req, res });
  const { name, favicon } = await getPageDetails(url, auth?.user?.name || "");
  const { os, browser, device } = parseAgent(userAgent);

  if (website === null) {
    try {
      website = await prisma.website.create({
        data: {
          id: cuid(),
          url: host,
          user: { connect: { id } },
          name,
          favicon,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          res.status(400).json({ error: "Invalid user id" });
          return;
        }
      }

      res
        .status(500)
        .json({ error: "Whoops something wen't wrong at our end, sorry!" });

      return;
    }
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

async function getPageDetails(
  url: string,
  userName: string
): Promise<{ name: string; favicon: string | null }> {
  const resp = await fetch(url);
  const html = await resp.text();
  const $ = load(html);

  let favicon = $("link[rel='icon']").attr("href") || null;
  const title = $("title").text();

  // remove all the seperators
  let [name] = title.split(/[-|:|−|–]/);

  if (!name) {
    name = `${userName}'s website`;
  }

  name = name.trim();
  favicon = favicon ? new URL(favicon, url).href : null;
  favicon = favicon ? await imageUrl(favicon) : null;

  return { name, favicon };
}

async function imageUrl(url: string) {
  const resp = await fetch(url);
  const blob = await resp.blob();
  const buffer = await blob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return `data:${blob.type};base64,${base64}`;
}
