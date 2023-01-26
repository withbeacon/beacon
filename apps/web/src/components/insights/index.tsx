import Chart from "./chart";
import { ArrowUpIcon } from "@beacon/ui";

import useWebsiteStore from "~/store/website";

export interface InsightCardProps {
  label: string;
  value: string | number;
  data: Record<number, number>;
  timeFormat: "daily" | "weekly" | "monthly";
}

function InsightCard({ data, label, value, timeFormat }: InsightCardProps) {
  return (
    <div className="hide-scrollbar flex h-48 min-w-full flex-col gap-8 overflow-scroll rounded-xl border border-gray-200 pt-4 dark:border-gray-800 lg:w-full lg:min-w-fit lg:overflow-hidden">
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <span className="text-base text-gray-600 dark:text-gray-400">
            {label}
          </span>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>

        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <ArrowUpIcon className="h-5 w-5" />
          <span className="text-base font-medium">24%</span>
        </div>
      </div>

      <Chart data={data} timeFormat={timeFormat} />
    </div>
  );
}

export function SessionInsights() {
  const { sessions, timeFormat } = useWebsiteStore.getState().metrics;
  const value = useWebsiteStore.getState().sessions;

  return (
    <InsightCard
      label="Sessions"
      timeFormat={timeFormat}
      data={sessions}
      value={value}
    />
  );
}

export function PageViewInsights() {
  const { pageViews, timeFormat } = useWebsiteStore.getState().metrics;
  const value = useWebsiteStore.getState().pageViews;

  return (
    <InsightCard
      label="Page Views"
      timeFormat={timeFormat}
      data={pageViews}
      value={value}
    />
  );
}

export function InsightsShimmer({ label }: Pick<InsightCardProps, "label">) {
  return (
    <div className="hide-scrollbar flex h-48 min-w-full flex-col gap-8 overflow-scroll rounded-xl border border-gray-200 pt-4 dark:border-gray-800 lg:w-full lg:min-w-fit lg:overflow-hidden">
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <span className="text-base text-gray-600 dark:text-gray-400">
            {label}
          </span>
          <h2 className="text-3xl font-bold">0</h2>
        </div>

        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <ArrowUpIcon className="h-5 w-5" />
          <span className="text-base font-medium">0%</span>
        </div>
      </div>
    </div>
  );
}
