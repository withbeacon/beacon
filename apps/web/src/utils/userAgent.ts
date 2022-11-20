type Device = "Desktop" | "Mobile";

interface ParsedAgent {
  os: string;
  browser: string;
  device: Device;
}

export function parseAgent(agent: string): ParsedAgent {
  return {
    os: getOs(agent),
    browser: getBrowser(agent),
    device: getDevice(agent),
  }
}

function getOs(agent: string): string {
  const indexOf = (os: string): boolean => agent.indexOf(os) > -1;

  const operatingSystems = {
    "Windows": "Windows",
    "Mac": "MacOS",
    "X11": "Linux",
  }

  for (const [os, name] of Object.entries(operatingSystems)) {
    if (indexOf(os)) {
      return name;
    }
  }

  return "Unknown";
}

function getBrowser(agent: string): string {
  const browsers = [
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

  for (const { regex, name } of browsers) {
    if (regex.test(agent)) {
      return name;
    }
  }

  return "Unknown";
}

function getDevice(agent: string): Device {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(agent);
  return isMobile ? "Mobile" : "Desktop";
}
