import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import type { Mode } from "~/store";

import { Bar, XAxis, Tooltip, ResponsiveContainer, BarChart } from "recharts";
import { EyeIcon, UserIcon } from "@bud/ui";

import { trpc } from "~/utils";
import { formatDate } from "@bud/basics";
import { primary, gray } from "@bud/config/colors";
import { cva } from "class-variance-authority";
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
    <div className="mb-6 hidden h-full w-full px-6 sm:block">
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

interface BarTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  mode: Mode;
}

function BarTooltip({
  active = false,
  mode = "pageViews",
  payload,
}: BarTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0];

    return (
      <div className="flex flex-col gap-2 rounded border-none bg-white p-2 shadow outline-none dark:bg-gray-900">
        <div className="flex gap-2">
          {mode === "pageViews" ? <EyeIcon /> : <UserIcon />}
          <span>{data?.value}</span>
        </div>
      </div>
    );
  }

  return null;
}

const buttonStyles = cva("flex items-center gap-2 px-4 py-2", {
  variants: {
    l: {
      true: "rounded-l-lg",
    },
    r: {
      true: "rounded-r-lg",
    },
    active: {
      true: "bg-gray-800 text-gray-100",
      false: "text-gray-800",
    },
  },
});

interface ChartButtonProps extends VariantProps<typeof buttonStyles> {
  onClick?: () => void;
}

function ChartButton({
  onClick,
  children,
  ...props
}: PropsWithChildren<ChartButtonProps>) {
  return (
    <button onClick={() => onClick?.()} className={buttonStyles(props)}>
      {children}
    </button>
  );
}
