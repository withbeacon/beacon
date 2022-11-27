import { Prisma, PrismaClient } from "@prisma/client";
import Redis from "ioredis";

import { createPrismaRedisCache } from "prisma-redis-middleware";

if (!process.env.REDIS_URL || !process.env.REDIS_PASSWORD) {
  throw new Error("Missing REDIS_URL or REDIS_PASSWORD");
}

const redisClient = new Redis(
  `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`
);

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  models: [
    { model: "User", excludeMethods: ["findMany"] },
    { model: "Post", cacheTime: 180, cacheKey: "article" },
  ],
  storage: {
    type: "redis",
    options: {
      client: redisClient,
      invalidation: { referencesTTL: 300 },
      log: console,
    },
  },
  cacheTime: 300,
  excludeModels: ["User", "Account", "Session"],
  excludeMethods: ["count", "groupBy"],
  onError: (key) => console.error("[redis] error: ", key),
  onHit: (key) => console.info("[redis] hit ", key),
  onMiss: (key) => console.info("[redis] miss: ", key)
});

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

prisma.$use(cacheMiddleware);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

