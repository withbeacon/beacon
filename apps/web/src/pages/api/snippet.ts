import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    headers: { host },
  } = req;

  return res.json({
    snippet: `<script defer src="${host}/track.js"></script>`,
  });
}
