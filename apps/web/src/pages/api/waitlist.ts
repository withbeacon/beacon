import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import { prisma } from "@beacon/db";
import { z } from "zod";
import rateLimit from "~/utils/ratelimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 waitlist joins per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute

    if (req.method === "POST") {
      const email = z.string().email().safeParse(req.body.email);

      if (!email.success) {
        res.status(400).json({ message: "Invalid email" });
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
            res.status(400).json({ message: "Email already exists" });
            return;
          }
        }
      }
    }
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
    return;
  }

  res.status(500).json({ message: "Something went wrong" });
}
