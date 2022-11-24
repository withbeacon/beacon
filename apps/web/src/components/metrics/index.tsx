import { PagesMetrics } from "./pages";
import { UtmMetrics } from "./utm";

export function Metrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-auto wrap gap-4 mx-6">
      <PagesMetrics />
      <UtmMetrics />
    </div>
  )
}


