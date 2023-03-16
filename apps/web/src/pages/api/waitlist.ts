import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import { prisma } from "@beacon/db";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const email = z.string().email().safeParse(req.body.email);

    if (!email.success) {
      res.status(400).json({ error: "Invalid email" });
      return;
    }

    try {
      await prisma.waitlist.create({
        data: {
          email: email.data,
        },
      });

      res.status(200).json({ success: true });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          res.status(400).json({ error: "Email already exists" });
          return;
        }
      }
    }
  }

  res.status(500).json({ error: "Something went wrong" });
}
