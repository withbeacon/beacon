import {
  url,
  id,
  screen,
  device,
  os,
  referrer,
  title,
  browser,
} from "./client";
import { COLLECT_API } from "./constants";

if (!id) {
  throw new Error("Missing tracking id");
}

type Events = {
  [key: string]: EventData;
};

type EventData = {
  [key: string]: boolean;
};

let visitTime = 0;
let paused = false;

const timer = setInterval(() => {
  if (!paused) {
    visitTime += 500;
  }
}, 500);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    const payload = {
      id,
      url,
      visitTime,
      screen,
      device,
      os,
      referrer,
      title,
      browser,
      events,
    };

    fetch(COLLECT_API, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
});

const eventElems = document.querySelectorAll("[data-event]");
let events: Events = {};

function listenEvt(data: EventData, name: string, event: string) {
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
  let data: EventData = {};

  if (!name || !event) {
    return;
  }

  evt.addEventListener(event, () => listenEvt(data, name, event));
});

window.addEventListener("blur", async () => {
  console.log({ events });
  paused = true;
});

window.addEventListener("focus", async () => {
  paused = false;
});

window.addEventListener("beforeunload", async () => {
  clearInterval(timer);
});
