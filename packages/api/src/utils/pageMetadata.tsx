import { load } from "cheerio";

export async function pageMetadata(
  url: string,
  userName: string | undefined | null
): Promise<{
  name: string;
  favicon: string | null;
}> {
  const resp = await fetch(url);
  const html = await resp.text();
  const $ = load(html);

  let favicon = $("link[rel='icon']").attr("href") || null;
  let title = $("title").text();

  // remove all the seperators
  let [name, _] = title.split(/[-|:|−|–]/);

  if (!name) {
    name = `${userName}'s website`;
  }

  name = name.trim();
  favicon = favicon ? new URL(favicon, url).href : null;
  favicon = favicon ? await imageUrl(favicon) : null;

  return { name, favicon };
}

export async function imageUrl(url: string) {
  const resp = await fetch(url);
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
}
