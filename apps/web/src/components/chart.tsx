import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import type { Mode } from "~/store";
import { Bar, XAxis, Tooltip, ResponsiveContainer, BarChart } from "recharts";
import { EyeIcon, UserIcon } from "@spark/ui";

import { trpc, date, diffInDays, formatDate } from "~/utils";
import { useWebsite, useMode } from "~/store";
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

  const query = trpc.website[mode].useQuery({
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

  const days = query.data?.reduce((rest, session) => {
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
    <div className="w-full h-full px-6 mb-6">
      <div className="relative h-96 w-full pt-4 px-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-soft-base">
        <div className="h-full w-full">
          <>
            <div className="flex justify-end items-center rounded-lg">
              <ChartButton
                active={mode === "pageViews"}
                onClick={() => setMode("pageViews")}
                l
              >
                Page Visits
              </ChartButton>
              <ChartButton
                active={mode === "sessions"}
                onClick={() => setMode("sessions")}
                r
              >
                Sessions
              </ChartButton>
            </div>
            <ResponsiveContainer height={320} width="100%">
              <BarChart width={50} height={200} data={data}>
                <defs>
                  <linearGradient
                    id="bar-background"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0.05} />
                  </linearGradient>

                  <linearGradient
                    id="bar-stroke"
                    x1="50%"
                    y1="100%"
                    x2="50%"
                    y2="0%"
                  >
                    <stop
                      offset="1.5%"
                      style={{
                        stopColor: "rgba(249, 115, 22)",
                        stopOpacity: 0,
                      }}
                    />
                    <stop
                      offset="0%"
                      style={{
                        stopColor: "rgba(249, 115, 22)",
                        stopOpacity: 1,
                      }}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  axisLine={{ stroke: "hsl(0, 0%, 90%)" }}
                  dataKey="name"
                  tickLine={false}
                />
                <Tooltip
                  content={<BarTooltip mode={mode} />}
                  wrapperStyle={{ outline: "none", zIndex: 1 }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  radius={[8, 8, 0, 0]}
                  dataKey="value"
                  fill="url(#bar-background)"
                  stroke="url(#bar-stroke)"
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        </div>
      </div>
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
      <div className="bg-white shadow rounded p-2 outline-none border-none flex flex-col gap-2">
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
      false: "bg-gray-100 text-gray-800",
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
