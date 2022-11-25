import { MetricsContainer } from "./container";
import { MetricsHeader } from "./header";

import { useState } from "react";
import { useWebsite } from "~/store";
import { trpc } from "~/utils";

export function UtmMetrics() {
  const [id] = useWebsite();
  const [utmParam, setUtmParam] = useState("utm_source");

  const query = trpc.website.sources.useQuery({
    websiteId: id as string,
    utmParam,
  });

  if (!query.data) return <></>;

  const total = Object.values(query.data).reduce((a, b) => a + b, 0);
  const percent = (v: number): number => (v * 100) / total;
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
    }
  ]

  return (
    <MetricsContainer>
      <MetricsHeader title="UTM" options={options} />
      <table>
        <tbody className="relative flex flex-col gap-4 w-full h-full">
          {Object.entries(query.data)
            .sort(([, a], [, b]) => b - a)
            .map(([key, value]) => (
              <tr className="relative flex justify-between text-lg px-4 py-2 rounded-xl overflow-hidden" key={key}>
                <td className="z-[1]">{key}</td>
                <td className="z-[1]">{value}</td>
                <td
                  className="absolute top-0 left-0 bg-primary-200 z-0 h-full"
                  style={{ width: `${percent(value)}%` }}
                ></td>
              </tr>
            ))}
        </tbody>
      </table>
    </MetricsContainer>
  );
}

