if (!(typeof window !== "undefined" && window.document)) {
  throw new Error(
    "[beacon] stopping the execution as not currently on client side"
  );
}

if (window.location.hostname === "localhost") {
  throw new Error("[beacon] stopping the execution as on localhost");
}

import {
  screen,
  referrer,
  userAgent,
  title,
  isDoNotTrackEnabled,
  timezone,
  track404,
} from "./client";
import { COLLECT_API } from "./constants";

if (isDoNotTrackEnabled) {
  throw new Error("[beacon] not tracking as do not track is enabled");
}

let visitTime = 0;
let paused = false;

const timer = setInterval(() => {
  if (!paused) {
    visitTime += 500;
  }
}, 500);

async function send(url: undefined | string = window.location.href) {
  const { status } = await fetch(url);

  if (status === 404 && track404) {
    return;
  }

  const payload = {
    url: url,
    visitTime,
    screen,
    referrer,
    userAgent,
    title,
    events,
    timezone,
  };

  if (
    window.beacon?.before &&
    window.beacon.before({ pathname: window.location.pathname }) === null
  ) {
    return;
  }

  fetch(COLLECT_API, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    send();
  }
});

const eventElems = document.querySelectorAll("[data-event]");
let events: Record<string, Record<string, boolean>> = {};

function listenEvt(data: Record<string, boolean>, name: string, event: string) {
  data = {
    ...data,
    [event + "ed"]: true,
  };

  events = {
    ...events,
    [name]: data,
  };
}

eventElems.forEach((evt) => {
  const name = evt.getAttribute("data-event-name");
  const event = evt.getAttribute("data-event");
  let data: Record<string, boolean> = {};

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

let currentUrl = "";

const observer = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    send(currentUrl);
  }
});

observer.observe(document, { subtree: true, childList: true });

type PageEvent = {
  pathname: string;
};

declare global {
  interface Window {
    beacon?: {
      before?: ({ pathname }: PageEvent) => PageEvent | null;
    };
  }
}
