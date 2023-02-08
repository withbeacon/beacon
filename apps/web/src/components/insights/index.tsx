import Chart from "./chart";
import { ArrowUpIcon, ArrowDownIcon } from "@beacon/ui";

import useWebsiteStore from "~/store/website";
import { cx } from "class-variance-authority";

export interface InsightCardProps {
  label: string;
  value: string | number;
  data: Record<number, number>;
  timeFormat: "daily" | "weekly" | "monthly";
  growth: number;
}

function InsightCard({
  data,
  label,
  value,
  timeFormat,
  growth,
}: InsightCardProps) {
  growth = growth * -1;
  return (
    <div className="hide-scrollbar flex h-48 min-w-full flex-col gap-8 overflow-scroll rounded-xl border border-gray-200 pt-4 dark:border-gray-800 lg:w-full lg:min-w-fit lg:overflow-hidden">
      <div className="flex justify-between px-4">
        <div className="flex flex-col">
          <span className="text-base text-gray-600 dark:text-gray-400">
            {label}
          </span>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>

        <div
          className={cx(
            "flex items-center gap-2",
            growth > -1
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {growth > -1 ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
          <span className="text-base font-medium">
            {growth === Infinity ? "1000" : growth.toFixed()}%
          </span>
        </div>
      </div>

      <Chart data={data} timeFormat={timeFormat} />
    </div>
  );
}

export function SessionInsights() {
  const { sessions, timeFormat } = useWebsiteStore.getState().metrics;
  const value = useWebsiteStore.getState().sessions;
  const growth = useWebsiteStore.getState().growth;

  return (
    <InsightCard
      label="Sessions"
      timeFormat={timeFormat}
      data={sessions}
      value={value}
      growth={growth.sessions}
    />
  );
}

export function PageViewInsights() {
  const { pageViews, timeFormat } = useWebsiteStore.getState().metrics;
  const value = useWebsiteStore.getState().pageViews;
  const growth = useWebsiteStore.getState().growth;

  return (
    <InsightCard
      label="Page Views"
      timeFormat={timeFormat}
      data={pageViews}
      value={value}
      growth={growth.pageViews}
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
