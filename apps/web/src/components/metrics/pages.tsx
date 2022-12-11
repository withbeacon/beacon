import { MetricsContainer } from "./container";
import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function PagesMetrics({ data }: Props) {
  return (
    <MetricsContainer>
      <MetricsHeader title="Top Pages" />
      <MetricsTable data={data} />
    </MetricsContainer>
  );
}
