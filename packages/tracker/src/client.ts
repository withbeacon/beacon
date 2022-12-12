export const { href: url } = window.location;
export const { width, height } = window.screen;
export const { userAgent, doNotTrack } = navigator;
export const { referrer } = document;
export const screen = `${width}x${height}`;
export const isDoNotTrackEnabled = doNotTrack === '1';

export const { currentScript: script } = document;

if (!script) {
  throw new Error("[bud] unable to get the script for bud analytics")
}

export const id = script.getAttribute("data-id");
export const title = script.getAttribute("data-website-name") ?? document.title;
