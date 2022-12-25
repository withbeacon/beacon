import type { Metrics } from "~/types";

interface Params {
  from: Date;
  to: Date;
  id: string;
}

export async function getMetrics({ from, to, id }: Params): Promise<Metrics> {
  const resp = await fetch(`/api/metrics/${id}?from=${+from}&to=${+to}`);
  return (await resp.json()) as Metrics;
}
