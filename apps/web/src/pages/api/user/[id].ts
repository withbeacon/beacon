import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client"
import { prisma } from "@beacon/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: {
          id: id as string,
        },
      });

      res.status(200).json({ message: "Ok" });
      return;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          res.status(404).json({ message: "User not found" });
          return;
        }

        res.status(500).json({ message: "Internal server message" });
        return;
      }
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
