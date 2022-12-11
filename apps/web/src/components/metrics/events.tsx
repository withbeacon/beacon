import { MetricsContainer } from "./container";
import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function EventsMetrics({ data }: Props) {
  return (
    <MetricsContainer>
      <MetricsHeader title="Events" />
      <MetricsTable data={data} />
    </MetricsContainer>
  );
}
