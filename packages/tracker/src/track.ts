import { url, id, screen, referrer, title, userAgent } from "./client";
import { COLLECT_API } from "./constants";

if (!id) {
  throw new Error("Missing tracking id");
}

type Events = Record<string, Record<string, boolean>>;

let visitTime = 0;
let paused = false;

const timer = setInterval(() => {
  if (!paused) {
    visitTime += 500;
  }
}, 500);

function send() {
  const payload = {
    id,
    url,
    visitTime,
    screen,
    referrer,
    userAgent,
    title,
    events,
  };

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
let events: Events = {};

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

let previousUrl = "";

window.addEventListener('popstate', function() {
  if (previousUrl !== window.location.href) {
    send();
  }

  previousUrl = window.location.href;
});

