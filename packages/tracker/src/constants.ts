import { script } from "./client";

const endpoint = script.getAttribute("data-endpoint") ?? "/api/collect";

function getBaseUrl() {
  const url = new URL(script.getAttribute("src"));
  return `${url.protocol}//${url.host}`;
}

export const BASE_URL = getBaseUrl();
export const COLLECT_API = BASE_URL + endpoint;
