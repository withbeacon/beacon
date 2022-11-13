import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@spark/db";
import { getSession } from "~/utils";
import { getServerSession } from "@spark/auth";
import { load } from "cheerio";
import cuid from "cuid";

type BodyParams = {
  id: string;
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

// what this does currently:
// gets the website id and creates the session if not exists
// then does all the tracking stuff, and deletes the sessiona after 24h.

// what we want to do now:
// get the user id, crate the website if not exists and do all the
// remaining stuff the same way as before.

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

  const { id, url, visitTime, referrer, title, events, ...body }: BodyParams =
    JSON.parse(req.body);

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
  const name = await getName(url, auth?.user?.name || "");
  const favicon = await getFavicon(url);

  if (website === null) {
    try {
      await prisma.website.create({
        data: {
          id: cuid(),
          url: host,
          user: { connect: { id } },
          name,
          favicon
        },
      });
    } catch (err) {
      res.status(500).json({ error: "Whoops something wen't wrong at our end, sorry!" });
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
        id: sessionId,
        ...body,
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

async function getFavicon(url: string): Promise<string | null> {
  const paths = ["/favicon.svg", "/favicon.ico", "/favicon.png"];

  for (const path of paths) {
    const faviconUrl = url + path;
    const resp = await fetch(faviconUrl);

    if (resp.status === 200) {
      return faviconUrl;
    }
  }

  return null;
}

async function getName(url: string, userName: string): Promise<string> {
  const resp = await fetch(url);
  const html = await resp.text();
  const $ = load(html);

  let title = $("title").text();

  // remove all the seperators
  let [name, _] = title.split(/[-|:|−|–]/);

  if (!name) {
    return `${userName}'s website`;
  }

  return name.trim();
}
