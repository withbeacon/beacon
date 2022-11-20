export const { href: url } = window.location;
export const { width, height } = window.screen;
export const { userAgent } = navigator;
export const { referrer } = document;
export const screen = `${width}x${height}`;

const { currentScript } = document;

if (!currentScript) {
  throw new Error("Unable to get the spark script");
}

export const id = currentScript.getAttribute("data-id");
export const title =
  currentScript.getAttribute("data-website-name") ?? document.title;

