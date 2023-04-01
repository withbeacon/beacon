"use client";

import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

import { useState } from "react";

interface Props {
  data: Record<string, Record<string, number>>;
}

export function SourceMetrics({ data }: Props) {
  const [utmParam, setUtmParam] = useState("referrer");
  const isActive = (val: string): boolean => utmParam === val;

  const options = [
    {
      title: "Referrer",
      active: isActive("referrer"),
      onClick: () => setUtmParam("referrer"),
    },
    {
      title: "Source",
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
    <MetricsTable title="Source" dataValueType="Views" data={data[utmParam] || {}}>
      <MetricsHeader title="Sources" options={options} />
    </MetricsTable>
  );
}
