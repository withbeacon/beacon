export interface Metrics {
  devices: Record<string, number>;
  browsers: Record<string, number>;
  countries: Record<string, number>;
  pages: Record<string, number>;
  events: Record<string, number>;
  queryParams: Record<string, Record<string, number>>;
  sessions: Record<string | number, number>;
  pageViews: Record<string | number, number>;
  timeFormat: "daily" | "weekly" | "monthly";
}

