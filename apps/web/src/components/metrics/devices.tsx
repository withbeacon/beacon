import { MetricsContainer } from "./container";
import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function DevicesMetrics({ data }: Props) {
  return (
    <MetricsContainer>
      <MetricsHeader title="Top Devices" />
      <MetricsTable data={data} />
    </MetricsContainer>
  );
}
