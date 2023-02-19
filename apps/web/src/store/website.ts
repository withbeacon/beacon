import type { Website as PrismaWebsite } from "@prisma/client";
import type { Metrics } from "~/types";
import type { Insights } from "~/utils/db/insights";

import { create } from "zustand";

export interface Website
  extends Pick<PrismaWebsite, "name" | "url" | "createdAt" | "public"> {
  pageViews: number;
  sessions: number;
  metrics: Metrics;
}

export interface WebsiteState extends Website {
  setWebsite: (website: Website) => void;
  growth: Insights["growth"];
  minDate: Date;
}

const useWebsiteStore = create<WebsiteState>()((set) => ({
  name: "",
  url: "",
  pageViews: 0,
  sessions: 0,
  public: false,
  createdAt: new Date(),
  minDate: new Date(),
  metrics: {
    devices: {},
    browsers: {},
    countries: {},
    pages: {},
    events: {},
    queryParams: {},
    sessions: {},
    pageViews: {},
    timeFormat: "weekly",
  },
  growth: {
    pageViews: 0,
    sessions: 0,
  },
  setWebsite: (website) => set(website),
}));

export default useWebsiteStore;
