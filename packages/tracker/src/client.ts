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

export const websiteId = currentScript.getAttribute("data-website-id");
export const title = currentScript.getAttribute("data-website-name") ?? document.title;

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
  if (userAgent.indexOf("Opera") || userAgent.indexOf("OPR")) {
    return "Opera";
  } else if (userAgent.indexOf("Chrome")) {
    return "Chrome";
  } else if (userAgent.indexOf("Safari")) {
    return "Safari";
  } else if (userAgent.indexOf("Firefox")) {
    return "Firefox";
  } else if (userAgent.indexOf("MSIE") || !!document["documentMode"] == true) {
    return "IE";
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


