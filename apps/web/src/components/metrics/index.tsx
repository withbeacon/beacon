import { PagesMetrics } from "./pages";
import { UtmMetrics } from "./utm";
import { EventsMetrics } from "./events";
import { CountriesMetrics } from "./countries";
import { BrowsersMetrics } from "./browsers";
import { DevicesMetrics } from "./devices";

import { useDate, useWebsite } from "~/store";
import { trpc } from "~/utils";

function hasData<T>(data: T): boolean {
  return JSON.stringify(data) !== "{}";
}

export function Metrics() {
  const [id] = useWebsite();
  const [date] = useDate();

  const { data, error, isLoading, isError } = trpc.website.metrics.useQuery({
    websiteId: id as string,
    from: date.from,
    to: date.to,
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  const { pages, events, countries, browsers, devices, queryParams } = data;

  return (
    <div className="wrap mx-6 grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2">
      {hasData(pages) && <PagesMetrics data={pages} />}
      {hasData(queryParams) && <UtmMetrics data={queryParams} />}
      {hasData(countries) && <CountriesMetrics data={countries} />}
      {hasData(browsers) && <BrowsersMetrics data={browsers} />}
      {hasData(devices) && <DevicesMetrics data={devices} />}
      {hasData(events) && <EventsMetrics data={events} />}
    </div>
  );
}
