import type { NextApiRequest } from "next";
import { createHash } from "crypto";
import { getClientIp } from "request-ip";

/**
 * description Takes the ip address and the host (base url) and returns it's hash
 * @param {NextApiResponse} req Next API route request
 * @param {string} host The base url or host of the client
 **/
export function getSession(req: NextApiRequest, host: string): string {
  const ip = getClientIp(req);

  return createHash("sha256")
    .update(ip + host)
    .digest("hex");
}
