export default {
  async fetch(req: Request) {
    const headers = {
      "Content-Type": "text/html",
      redirect: "follow",
    };

    let { pathname } = new URL(req.url);
    pathname = pathname.slice(1);
    pathname = (pathname.startsWith("http://") || pathname.startsWith("https://")) ? pathname : "http://" + pathname;

    if (pathname === "/") {
      return new Response("404 Not Found", { status: 404 });
    }

    if (!isUrl(pathname)) {
      return new Response("404 Not Found", { status: 404 });
    }

    const url = new URL(pathname);

    let favicon: string | null = "";
    let response = await fetch(url.origin, { headers });

    if (!response.ok) {
      return new Response(
        `Error: ${response.status} ${response.statusText}`,
        { status: response.status }
      );
    }

    response = new HTMLRewriter()
      .on('link[rel*="icon"]', {
        async element(elem) {
          // avoid low quality favicons and mask icons
          if (
            elem.getAttribute("rel") === "mask-icon" ||
            elem.getAttribute("href")?.includes("16x16") ||
            elem.getAttribute("href")?.includes("32x32") ||
            elem.getAttribute("href")?.includes("48x48") ||
            elem.getAttribute("href")?.includes("64x64") ||
            elem.getAttribute("href")?.includes("96x96")
          ) {
            return;
          }

          favicon = elem.getAttribute("href");

          if (favicon?.startsWith("/")) {
            favicon = favicon?.startsWith("//") ? "https:" : url.origin + favicon;
          } else if (!favicon?.startsWith("http")) {
            favicon = url.origin + "/" + favicon;
          }
        },
      })
      .transform(response);

    await response.text();

    if (!favicon) {
      const ico = await fetch(url.origin + "/favicon.ico");

      if (ico.status === 200) {
        const resp = new Response(ico.body, { headers: ico.headers });
        resp.headers.set("Cache-Control", "max-age=86400");

        return resp;
      }
    }

    const icon = await fetch(favicon);

    if (icon.status === 200) {
      const iconResp = new Response(icon.body, { headers: icon.headers });
      iconResp.headers.set("Cache-Control", "max-age=86400");

      return iconResp;
    }

    // use icon.horse as a fallback
    const iconHorse = await fetch("https://icon.horse/favicon.ico");
    const iconHorseResp = new Response(iconHorse.body, { headers: iconHorse.headers, });
    iconHorseResp.headers.set("Cache-Control", "max-age=86400");

    return iconHorseResp;
  },
};

function isUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}
