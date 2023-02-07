"use client";

import type { InsightCardProps } from ".";
import { Area, Tooltip, ResponsiveContainer, AreaChart } from "recharts";

import { formatDate } from "@beacon/basics";
import { primary } from "@beacon/config/colors";
import { useTheme } from "@wits/next-themes";

type ChartProps = Pick<InsightCardProps, "data" | "timeFormat">;

export default function Chart({ data, timeFormat }: ChartProps) {
  const { resolvedTheme: theme } = useTheme();

  const chartData = Object.entries(data).map(([timestamp, value]) => ({
    name: formatDate(new Date(+timestamp), timeFormat),
    timestamp,
    value,
  }));

  return (
    <ResponsiveContainer>
      <AreaChart
        margin={{ top: 8, left: 0, bottom: 1, right: 0 }}
        data={chartData}
      >
        <defs>
          <linearGradient id="chart-background" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primary["500"]} stopOpacity={0.5} />
            <stop offset="100%" stopColor={primary["500"]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          offset={10}
          wrapperStyle={{ outline: "none" }}
          position={{ y: 0 }}
          content={({ active, payload }) => (
            <CustomTooltip active={active} payload={payload as any} />
          )}
        />
        <Area
          type="monotone"
          dataKey="value"
          fill="url(#chart-background)"
          stroke={theme ? primary["400"] : primary["500"]}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    payload: { timestamp: string };
  }[];
}

function CustomTooltip({ active, payload }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    const time = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(+(payload[0]?.payload.timestamp as string))); // casting to string, then to number

    const formatNumber = Intl.NumberFormat("en", { notation: "compact" });

    return (
      <div className="gap-2 rounded border border-gray-200 dark:border-gray-700 bg-white px-2 py-1 shadow outline-transparent dark:bg-gray-800">
        <p className="font-medium">
          {formatNumber.format(payload[0]?.value as number)}
        </p>
        <p className="text-gray-600 dark:text-gray-400">{time}</p>
      </div>
    );
  }

  return null;
}
