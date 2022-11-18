import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { EyeIcon, UserIcon } from "@spark/ui";

import { trpc, date, diffInDays, formatDate } from "~/utils";
import { useActiveWebsite } from "~/hooks";

type ChartMode = "pageViews" | "sessions";

interface Props {
  from?: Date;
  to?: Date;
  mode?: ChartMode;
}

export default function Chart({
  from = new Date(date().setDate(date().getDate() - 7)),
  to = date(),
  mode = "pageViews",
}: Props) {
  const [id] = useActiveWebsite();

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
    <ResponsiveContainer height="100%" width="100%">
      <BarChart width={500} height={300} data={data}>
        <XAxis axisLine={false} tickLine={false} dataKey="name" />
        <Tooltip
          content={<BarTooltip mode={mode} />}
          wrapperStyle={{ outline: "none" }}
          cursor={{ fill: "transparent" }}
        />
        <Bar radius={8} dataKey="value" fill="hsl(32, 100%, 75%)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function sortDays(arr: string[]): string[] {
  return arr.map((a) => formatDate(new Date(a)));
}

interface BarTooltipProps {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  mode: ChartMode;
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
