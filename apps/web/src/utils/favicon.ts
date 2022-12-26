import { load } from "cheerio";

export async function getFavicon(url: string): Promise<string | null> {
  const resp = await fetch(url);
  const html = await resp.text();
  const $ = load(html);

  let favicon = $("link[rel='icon']").attr("href") || null;
  favicon = favicon ? new URL(favicon, url).href : null;

  return favicon ? await blob(favicon) : null;
}

async function blob(url: string) {
  const resp = await fetch(url);
  const blob = await resp.blob();
  const buffer = await blob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return `data:${blob.type};base64,${base64}`;
}

