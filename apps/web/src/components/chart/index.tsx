import { Bar, XAxis, Tooltip, ResponsiveContainer, BarChart } from "recharts";
import { BarTooltip } from "./tooltip";

import { trpc } from "~/utils";
import { formatDate } from "@bud/basics";
import { primary, gray } from "@bud/config/colors";
import { useWebsite, useDate, useMode } from "~/store";
import { useTheme } from "next-themes";

export default function Chart() {
  const [id] = useWebsite();
  const [mode] = useMode();
  const [date] = useDate();
  const { resolvedTheme } = useTheme();
  const { data: query } = trpc.website.metrics.useQuery({
    websiteId: id as string,
    from: date.from,
    to: date.to,
  });

  if (!query) {
    return null;
  }

  const data = Object.entries(query[mode]).map(([timestamp, value]) => ({
    name: formatDate(new Date(+timestamp), query.timeFormat),
    timestamp,
    value,
  }));

  return (
    <div className="my-4 hidden h-full w-full px-6 sm:block">
      <ResponsiveContainer height={320} width="100%">
        <BarChart width={50} height={200} data={data}>
          <defs>
            <linearGradient id="bar-background" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primary["500"]} stopOpacity={0.2} />
              <stop
                offset="95%"
                stopColor={primary["500"]}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <Bar
            radius={[8, 8, 0, 0]}
            dataKey="value"
            fill="url(#bar-background)"
            stroke={primary["500"]}
          />
          <XAxis
            dataKey="name"
            axisLine={{
              stroke: resolvedTheme === "dark" ? gray["800"] : gray["200"],
              strokeWidth: 1,
            }}
            tickLine={false}
          />
          <Tooltip
            content={<BarTooltip mode={mode} />}
            wrapperStyle={{ outline: "none", zIndex: 1 }}
            cursor={{ fill: "transparent" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

