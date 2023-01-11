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
        margin={{ top: 4, left: 0, bottom: 1, right: 0 }}
        data={chartData}
      >
        <defs>
          <linearGradient id="chart-background" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primary["500"]} stopOpacity={0.5} />
            <stop offset="100%" stopColor={primary["500"]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          fill="url(#chart-background)"
          stroke={theme ? primary["400"] : primary["500"]}
          strokeWidth={2}
        />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  );
}
