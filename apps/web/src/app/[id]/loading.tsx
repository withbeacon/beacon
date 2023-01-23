import { SidebarShimmer } from "~/components/sidebar";
import { InsightsShimmer } from "~/components/insights";
import { MetricsShimmer } from "~/components/metrics";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 m-4">
      <SidebarShimmer />

      <div className="ml-0 flex w-full flex-col gap-6 overflow-scroll lg:ml-64">
        <div className="hide-scrollbar flex gap-4 overflow-scroll lg:overflow-hidden">
          <InsightsShimmer label="Page Views" />
          <InsightsShimmer label="Sessions" />
        </div>

        <MetricsShimmer />
      </div>
    </div>
  );
}
