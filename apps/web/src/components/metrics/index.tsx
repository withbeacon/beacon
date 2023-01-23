import type { Metrics as MetricsType } from "~/types";
import { PagesMetrics } from "./pages";
import { UtmMetrics } from "./utm";
import { EventsMetrics } from "./events";
import { CountriesMetrics } from "./countries";
import { BrowsersMetrics } from "./browsers";
import { DevicesMetrics } from "./devices";

function hasData<T>(data: T): boolean {
  return JSON.stringify(data) !== "{}";
}

interface Props {
  data: MetricsType;
}

export default function Metrics({ data }: Props) {
  const { pages, events, countries, browsers, devices, queryParams } = data;

  return (
    <div className="wrap grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2">
      {hasData(pages) && <PagesMetrics data={pages} />}
      {hasData(queryParams) && <UtmMetrics data={queryParams} />}
      {hasData(countries) && <CountriesMetrics data={countries} />}
      {hasData(browsers) && <BrowsersMetrics data={browsers} />}
      {hasData(devices) && <DevicesMetrics data={devices} />}
      {hasData(events) && <EventsMetrics data={events} />}
    </div>
  );
}

export function MetricsShimmer() {
  const metrics = [
    {
      label: "Pages",
      tableHeader: ["Page", "Views"],
    },
    {
      label: "UTM",
      tableHeader: ["Source", "Views"],
    },
    {
      label: "Countries",
      tableHeader: ["Country", "Views"],
    },
    {
      label: "Browsers",
      tableHeader: ["Browser", "Views"],
    },
    {
      label: "Devices",
      tableHeader: ["Device", "Views"],
    },
    {
      label: "Events",
      tableHeader: ["Event", "Views"],
    },
  ] as const;

  return (
    <div className="wrap grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2">
      {metrics.map(({ label, tableHeader: [title, dataValueType] }) => (
        <div
          className="flex h-full w-full flex-col gap-4 rounded-xl border border-gray-200 px-6 pb-8 pt-5 dark:border-gray-800"
          key={label}
        >
          <div className="flex w-full items-center">
            <h2 className="text-lg font-semibold md:text-xl">{label}</h2>
          </div>
          <table className="flex h-full w-full flex-col gap-4">
            <thead>
              <tr className="flex justify-between text-gray-400 dark:text-gray-600">
                <th className="font-medium">{title.toUpperCase()}</th>
                <th className="font-medium">{dataValueType.toUpperCase()}</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
