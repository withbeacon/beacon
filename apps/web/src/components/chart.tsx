import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import type { Mode } from "~/store";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { EyeIcon, UserIcon } from "@spark/ui";

import { trpc, date, diffInDays, formatDate } from "~/utils";
import { useActiveWebsite } from "~/hooks";
import { modeAtom } from "~/store";
import { useAtom } from "jotai";
import { cva } from "class-variance-authority";

interface Props {
  from?: Date;
  to?: Date;
}

export default function Chart({
  from = new Date(date().setDate(date().getDate() - 7)),
  to = date(),
}: Props) {
  const [id] = useActiveWebsite();
  const [mode, setMode] = useAtom(modeAtom);

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
      <div className="relative w-full h-full pt-4 px-4 rounded-2xl bg-gray-50 border border-gray-200 shadow-soft-base">
        <>
          <div className="absolute top-5 right-6 flex gap-4 z-[2]">
            <div className="flex items-center rounded-lg">
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
          </div>
          <div className="h-full w-full">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart width={500} height={200} data={data}>
                <XAxis axisLine={false} tickLine={false} dataKey="name" />
                <Tooltip
                  content={<BarTooltip mode={mode} />}
                  wrapperStyle={{ outline: "none", zIndex: 1 }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar radius={8} dataKey="value" fill="hsl(32, 100%, 75%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
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
