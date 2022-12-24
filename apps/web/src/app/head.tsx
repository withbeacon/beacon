export default function Head() {
  const seo = {
    title:
      "Bud – fast, simple and privacy friendly analytics that you will love using.",
    description:
      "Bud is a fast, simple and privacy friendly analytics tool that you will love using.",
    socialImg:
      "https://github.com/vedantnn71/bud/raw/main/apps/web/public/social.png",
    url: "https://github.com/vedantnn71/bud",
    favicon: "/favicon.ico",
    handle: "@usebud",
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={seo.description} />
      <link rel="icon" href={seo.favicon} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={seo.handle} />
      <meta name="twitter:creator" content={seo.handle} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.socialImg} />

      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.socialImg} />
    </>
  );
}
