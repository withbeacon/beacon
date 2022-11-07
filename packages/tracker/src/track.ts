import {
  url,
  websiteId,
  screen,
  device,
  os,
  referrer,
  title,
  browser,
} from "./client";
import { COLLECT_API } from "./constants";

if (!websiteId) {
  throw new Error("Missing website id");
}
let visitTime = 0;
let paused = false;

const timer = setInterval(() => {
  if (!paused) {
    visitTime += 500;
  }
}, 500);

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.visibilityState === "hidden") {
      const payload = {
        websiteId,
        url,
        visitTime,
        screen,
        device,
        os,
        referrer,
        title,
        browser,
      };

      fetch(COLLECT_API, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
  },
);

window.addEventListener("blur", async () => {
  paused = true;
});

window.addEventListener("focus", async () => {
  paused = false;
});

window.addEventListener("beforeunload", async () => {
  clearInterval(timer);
});
