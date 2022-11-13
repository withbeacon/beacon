export const { href: url } = window.location;
export const { width, height } = window.screen;
export const { userAgent } = navigator;
export const { referrer } = document;
export const screen = `${width}x${height}`;
export const browser = getCurrentBrowser();
export const device = getDevice();
export const os = getOs();

const { currentScript } = document;

if (!currentScript) {
  throw new Error("Unable to get the spark script");
}

export const id = currentScript.getAttribute("data-id");
export const title =
  currentScript.getAttribute("data-website-name") ?? document.title;

function getOs(): string {
  if (userAgent.indexOf("Windows") > -1) {
    return "Windows";
  } else if (userAgent.indexOf("Mac") > -1) {
    return "Mac";
  } else if (userAgent.indexOf("X11") > -1) {
    return "Linux";
  }

  return "Unknown";
}

function getCurrentBrowser(): string {
  const regexes = [
    {
      regex: /MSIE ([0-9]{1,}[\.0-9]{0,})/,
      name: "Internet Explorer",
    },
    {
      regex: /edg/i,
      name: "Microsoft Edge",
    },
    {
      regex: /opr\//i,
      name: "Opera",
    },
    {
      regex: /chrome|chromium|crios/i,
      name: "Chrome",
    },
    {
      regex: /safari/i,
      name: "Safari",
    },
    {
      regex: /firefox|iceweasel|fxios/i,
      name: "Firefox",
    },
  ];

  for (const { regex, name } of regexes) {
    if (regex.test(userAgent)) {
      return name;
    }
  }

  return "Unknown";
}

function getDevice(): "Mobile" | "Desktop" {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);

  if (isMobile) {
    return "Mobile";
  }

  return "Desktop";
}
