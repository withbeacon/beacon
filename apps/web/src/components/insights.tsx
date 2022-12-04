import { ArrowUpIcon } from "@bud/ui";

import { cx } from "class-variance-authority";
import { trpc } from "~/utils";
import { useWebsite } from "~/store";

interface Props {
  label: string;
  value: number | string;
  growth: number;
  description: string;
}

function InsightCard({ label, value, growth, description }: Props) {
  return (
    <div className="flex flex-col p-4">
      <span className="text-sm text-gray-500 dark:text-gray-400 md:text-base">{label}</span>

      <div className="flex w-full justify-between" title={description}>
        <h2 className="mb-2 text-3xl font-bold md:text-4xl">{value}</h2>
        <div className={cx(
          "flex h-8 max-w-fit items-center gap-2 rounded-full dark px-3",
          growth < 0 ? "text-red-600 dark:text-red-200" : "text-green-600 dark:text-green-200"
        )}>
          <span className="text-sm md:text-base">{growth}%</span>
          <ArrowUpIcon
            className={cx("h-4 w-4", growth < 0 ? "rotate-180" : "rotate-0")}
          />
        </div>
      </div>
    </div>
  );
}

export function Insights() {
  const [id] = useWebsite();
  const query = trpc.website.get.useQuery(id || "");

  if (!id) {
    return <></>;
  }

  if (query.isLoading || !query.data) {
    return <></>;
  }

  function millisecondsToStandardTime(ms: number) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    if (hours) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    if (minutes) {
      return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
  }

  const stats = [
    {
      label: "Page Views",
      value: query.data.pageViews,
      growth: 8,
      description:
        "Page views are the number of times a user visits a page on your website.",
    },
    {
      label: "Sessions",
      value: query.data.sessions,
      growth: 2,
      description:
        "Sessions are the number of users who have visited your website.",
    },
    {
      label: "Avg Session Time",
      value: millisecondsToStandardTime(query.data.avgDuration || 0),
      growth: 5,
      description:
        "Average session time is the average amount of time a user spends on your website.",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 grid-rows-3 gap-4 py-2 px-4 text-gray-900 dark:text-gray-100 md:grid-cols-3 md:grid-rows-1">
      {stats.map((stat) => (
        <InsightCard {...stat} key={stat.label} />
      ))}
    </div>
  );
}
