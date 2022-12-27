// src/client.ts
var { width, height } = window.screen;
var { userAgent, doNotTrack } = navigator;
var { title, referrer } = document;
var screen = `${width}x${height}`;
var isDoNotTrackEnabled = doNotTrack === "1";
var { currentScript: script } = document;
if (!script) {
  throw new Error("[bud] unable to get the script for bud analytics");
}

// src/constants.ts
var endpoint = script.getAttribute("data-endpoint") ?? "/api/collect";
function getBaseUrl() {
  const url = new URL(script.getAttribute("src"));
  return `${url.protocol}//${url.host}`;
}
var BASE_URL = getBaseUrl();
var COLLECT_API = BASE_URL + endpoint;

// src/track.ts
if (!(typeof window !== "undefined" && window.document)) {
  throw new Error(
    "[bud] stopping the execution as not currently on client side"
  );
}
if (isDoNotTrackEnabled) {
  throw new Error("[bud] not tracking as do not track is enabled");
}
var visitTime = 0;
var paused = false;
var timer = setInterval(() => {
  if (!paused) {
    visitTime += 500;
  }
}, 500);
function send(url) {
  const payload = {
    url: url || window.location.href,
    visitTime,
    screen,
    referrer,
    userAgent,
    title,
    events
  };
  fetch(COLLECT_API, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    send();
  }
});
var eventElems = document.querySelectorAll("[data-event]");
var events = {};
function listenEvt(data, name, event) {
  data = {
    ...data,
    [event + "ed"]: true
  };
  events = {
    ...events,
    [name]: data
  };
}
eventElems.forEach((evt) => {
  const name = evt.getAttribute("data-event-name");
  const event = evt.getAttribute("data-event");
  let data = {};
  if (!name || !event) {
    return;
  }
  evt.addEventListener(event, () => listenEvt(data, name, event));
});
window.addEventListener("blur", async () => {
  paused = true;
});
window.addEventListener("focus", async () => {
  paused = false;
});
window.addEventListener("beforeunload", async () => {
  clearInterval(timer);
});
var currentUrl = "";
var observer = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    send(currentUrl);
  }
});
observer.observe(document, { subtree: true, childList: true });
