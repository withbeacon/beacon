import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import { getServerSession } from "@beacon/auth";
import { prisma } from "@beacon/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).end();
  }

  const session = await getServerSession({ req, res });

  if (!session) {
    return res.status(401).end();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string,
    },
    select: {
      id: true,
    }
  })

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const id = req.query.id as string;
  const website = await prisma.website.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
    },
  });

  if (!website) {
    res.status(404).json({ message: "Website not found" });
    return;
  }

  if (website.userId !== user.id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { name, url } = JSON.parse(req.body);
  const toUpdate: Pick<Prisma.WebsiteUpdateInput, "name" | "url"> = {};

  if (name) {
    toUpdate.name = name;
  } 

  if (url) {
    toUpdate.url = url;
  }

  try {
    await prisma.website.update({
      where: {
        id,
      },
      data: toUpdate,
    });

    return res.status(200).json({ message: "Ok" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({ message: "Website URL already exists" });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

}
