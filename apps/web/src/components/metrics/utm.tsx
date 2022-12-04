import { MetricsContainer } from "./container";
import { MetricsHeader } from "./header";

import { useState } from "react";

interface Props {
  data: Record<string, Record<string, number>>;
}

export function UtmMetrics({ data }: Props) {
  const [utmParam, setUtmParam] = useState("utm_source");

  const total = Object.values(data[utmParam] || {}).reduce((a, b) => a + b, 0);
  const percent = (val: number): number => (val * 100) / total;
  const isActive = (val: string): boolean => utmParam === val;

  const options = [
    {
      title: "Referrer",
      active: isActive("utm_source"),
      onClick: () => setUtmParam("utm_source"),
    },
    {
      title: "Campaign",
      active: isActive("utm_campaign"),
      onClick: () => setUtmParam("utm_campaign"),
    },
    {
      title: "Medium",
      active: isActive("utm_medium"),
      onClick: () => setUtmParam("utm_medium"),
    },
  ];

  return (
    <MetricsContainer>
      <MetricsHeader title="UTM" options={options} />
      <table>
        <tbody className="relative flex h-full w-full flex-col gap-4">
          {Object.entries(data[utmParam] || {})
            .sort(([_, a], [__, b]) => b - a)
            .map(([key, value]) => (
              <tr
                className="relative flex justify-between overflow-hidden rounded-xl px-4 py-2 text-lg"
                key={key}
              >
                <td className="z-[1]">{key}</td>
                <td className="z-[1]">{value}</td>
                <td
                  className="absolute top-0 left-0 z-0 h-full bg-gray-200 dark:bg-gray-700"
                  style={{ width: `${percent(value)}%` }}
                ></td>
              </tr>
            ))}
        </tbody>
      </table>
    </MetricsContainer>
  );
}
