import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import type { Mode } from "~/store";
import { Bar, XAxis, Tooltip, ResponsiveContainer, BarChart } from "recharts";
import { EyeIcon, UserIcon } from "@bud/ui";

import { trpc, date, diffInDays, formatDate } from "~/utils";
import { useWebsite, useMode } from "~/store";
import { useTheme } from "next-themes";
import { cva } from "class-variance-authority";

interface Props {
  from?: Date;
  to?: Date;
}

export default function Chart({
  from = new Date(date().setDate(date().getDate() - 7)),
  to = date(),
}: Props) {
  const [id] = useWebsite();
  const [mode, setMode] = useMode();
  const { resolvedTheme } = useTheme();

  const query = trpc.website.metrics.useQuery({
    websiteId: id as string,
    from,
    to,
  });

  const diff = diffInDays(from, to);

  const labels = sortDays(
    Array.from({ length: diff }, (_, i) =>
      new Date(new Date().setDate(to.getDate() - diff + i + 1)).toString()
    )
  );

  const days = query.data?.[mode].reduce((rest, session) => {
    const date = new Date(session.createdAt);
    const day = formatDate(date);

    if (rest[day]) {
      rest[day] += 1;
    } else {
      rest[day] = 1;
    }

    return rest;
  }, {} as Record<string, number>);

  const sortedLabels = labels.map((label) => {
    if (days?.[label]) {
      return days?.[label];
    } else {
      return 0;
    }
  });

  const data = sortedLabels.map((value, index) => ({
    name: labels[index],
    value,
  }));

  if (!query.data) return null;

  return (
    <div className="mb-6 h-full w-full px-6">
      <ResponsiveContainer height={320} width="100%">
        <BarChart width={50} height={200} data={data}>
          <defs>
            <linearGradient id="bar-background" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4178E1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#4178E1" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Bar
            radius={[8, 8, 0, 0]}
            dataKey="value"
            fill="url(#bar-background)"
            stroke="#4178E1"
          />
          <XAxis
            dataKey="name"
            axisLine={{ stroke: resolvedTheme === "dark" ? "#1C1D27" : "#E5E6EB", strokeWidth: 1 }}
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

function sortDays(arr: string[]): string[] {
  return arr.map((a) => formatDate(new Date(a)));
}

interface BarTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  mode: Mode;
}

function BarTooltip({
  active = false,
  mode = "pageViews",
  payload,
  label,
}: BarTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0];

    return (
      <div className="flex flex-col gap-2 rounded border-none bg-white p-2 shadow outline-none">
        <div className="flex gap-2">
          {mode === "pageViews" ? <EyeIcon /> : <UserIcon />}
          <span>{data?.value}</span>
        </div>
        <span>{label}</span>
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
