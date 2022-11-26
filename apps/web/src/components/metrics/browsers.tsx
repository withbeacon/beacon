import { MetricsContainer } from "./container";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function BrowsersMetrics({ data }: Props) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const percent = (v: number) => (v * 100) / total;

  return (
    <MetricsContainer>
      <MetricsHeader title="Top Browsers" />
      <table>
        <tbody className="relative flex flex-col gap-4 w-full h-full">
          {Object.entries(data)
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



