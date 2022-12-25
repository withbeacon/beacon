import type { Mode } from "~/store";
import type { Insights as InsightsType } from "~/utils/db";
import InsightCard from "./card";

interface Props {
  data: InsightsType;  
}

export default function Insights({ data }: Props) {

  const containerStyles =
    "hide-scrollbar flex flex-row gap-4 overflow-scroll p-4 text-gray-900 dark:text-gray-100";

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

  /*
  if (isLoading) {
    return (
      <div
        className={
          containerStyles +
          "first:bg-insight-card first:drop-shadow-insight-card"
        }
      >
        {[1, 2, 3].map(() => (
          <div
            key={`insights-skeleton-${id}`}
            className={
              "flex h-28 min-w-[75%] animate-pulse flex-col rounded-2xl bg-gray-200 p-4 py-3 outline-none dark:bg-gray-800 md:w-full md:min-w-0 md:py-4"
            }
          ></div>
        ))}
      </div>
    );
  }
  */

  if (!data) {
    return null;
  }

  const stats = [
    {
      mode: "pageViews" as Mode,
      label: "Page Views",
      value: data.pageViews,
      growth: 8,
      description:
        "Page views are the number of times a user visits a page on your website.",
    },
    {
      mode: "sessions" as Mode,
      label: "Sessions",
      value: data.sessions,
      growth: 2,
      description:
        "Sessions are the number of users who have visited your website.",
    },
    {
      mode: "viewDuration" as Mode,
      label: "Avg Session Time",
      value: millisecondsToStandardTime(data.avgDuration || 0),
      growth: 5,
      description:
        "Average session time is the average amount of time a user spends on your website.",
    },
  ];

  return (
    <div className={containerStyles}>
      {stats.map((stat) => (
        <InsightCard {...stat} key={stat.label} />
      ))}
    </div>
  );
}
