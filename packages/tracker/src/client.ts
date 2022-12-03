export const { href: url } = window.location;
export const { width, height } = window.screen;
export const { userAgent } = navigator;
export const { referrer } = document;
export const screen = `${width}x${height}`;

export const { currentScript: script } = document;

if (!script) {
  throw new Error("Unable to get the bud script");
}

export const id = script.getAttribute("data-id");
export const title = script.getAttribute("data-website-name") ?? document.title;
