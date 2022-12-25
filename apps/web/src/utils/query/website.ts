import type { Website } from "@prisma/client";

// NOTE: this type is for `/api/website/:id`, not for other endpoints!
export interface WebsiteResponse extends Website {
  pageViews: number;
  sessions: number;
  avgDuration: number;
}

export async function getWebsite(id: string): Promise<WebsiteResponse> {
  const resp = await fetch(`/api/website/${id}`);
  const data = await resp.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data as WebsiteResponse;
}

export async function getAllWebsites(): Promise<Website[]> {
  const resp = await fetch("/api/website/all");
  const data = await resp.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data as Website[];
}
