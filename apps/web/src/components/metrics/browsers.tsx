import { MetricsContainer } from "./container";
import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function BrowsersMetrics({ data }: Props) {
  return (
    <MetricsContainer>
      <MetricsHeader title="Top Browsers" />
      <MetricsTable data={data} />
    </MetricsContainer>
  );
}
