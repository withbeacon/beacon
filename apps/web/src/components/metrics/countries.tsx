import { MetricsContainer } from "./container";
import { MetricsTable } from "./table";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function CountriesMetrics({ data }: Props) {
  return (
    <MetricsContainer>
      <MetricsHeader title="Top Countries" />
      <MetricsTable data={data} />
    </MetricsContainer>
  );
}
