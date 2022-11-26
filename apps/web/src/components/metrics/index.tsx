import { PagesMetrics } from "./pages";
import { UtmMetrics } from "./utm";
import { EventsMetrics } from "./events";
import { CountriesMetrics } from "./countries";
import { BrowsersMetrics } from "./browsers";
import { DevicesMetrics } from "./devices";

import { useWebsite } from "~/store";
import { trpc } from "~/utils";

export function Metrics() {
  const [id] = useWebsite();

  const { data, error, isLoading, isError } = trpc.website.metrics.useQuery({
    websiteId: id as string,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error?.message}</div>;
  }

  const { pages, events, countries, browsers, devices, queryParams } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-auto wrap gap-4 mx-6">
      {pages && <PagesMetrics data={pages} />}
      {queryParams && <UtmMetrics data={queryParams} />}
      {countries && <CountriesMetrics data={countries} />}
      {browsers && <BrowsersMetrics data={browsers} />}
      {devices && <DevicesMetrics data={devices} />}
      {events && <EventsMetrics data={events} />}
    </div>
  );
}
