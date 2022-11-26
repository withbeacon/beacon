import { MetricsContainer } from "./container";
import { MetricsHeader } from "./header";

interface Props {
  data: Record<string, number>;
}

export function DevicesMetrics({ data }: Props) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const percent = (v: number) => (v * 100) / total;

  return (
    <MetricsContainer>
      <MetricsHeader title="Top Devices" />
      <table>
        <tbody className="relative flex h-full w-full flex-col gap-4">
          {Object.entries(data)
            .sort(([, a], [, b]) => b - a)
            .map(([key, value]) => (
              <tr
                className="relative flex justify-between overflow-hidden rounded-xl px-4 py-2 text-lg"
                key={key}
              >
                <td className="z-[1]">{key}</td>
                <td className="z-[1]">{value}</td>
                <td
                  className="absolute top-0 left-0 z-0 h-full bg-primary-200"
                  style={{ width: `${percent(value)}%` }}
                ></td>
              </tr>
            ))}
        </tbody>
      </table>
    </MetricsContainer>
  );
}
