export const { width, height } = window.screen;
export const { userAgent, doNotTrack } = navigator;
export const { title, referrer } = document;
export const screen = `${width}x${height}`;
export const isDoNotTrackEnabled = doNotTrack === '1';
export const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const { currentScript: script } = document;
export const track404 = script.getAttribute("data-track-404") === "true";

if (!script) {
  throw new Error("[beacon] unable to get the script for beacon analytics")
}

