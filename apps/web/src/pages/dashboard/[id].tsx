import { Nav, Insights, Metrics } from "~/components";
import { Loading } from "@bud/ui";

import { useWebsite, useDate } from "~/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "~/utils";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("~/components/chart"), {
  loading: () => null,
});

export default function Analytics() {
  const router = useRouter();
  const [date] = useDate();
  const { id } = router.query;
  const { isLoading, isError, data, error } = trpc.website.get.useQuery({
    id: id as string,
    from: date.from,
    to: date.to,
  });

  const [_, setId] = useWebsite();

  useEffect(() => {
    if (id === null || data === null) {
      return;
    }

    setId(id as string);
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (error.data?.code === "NOT_FOUND") {
      router.push("/");
      return <></>;
    }

    return <div>Failed to load website</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <Nav />
      <Insights />
      <Chart />
      <Metrics />
    </div>
  );
}
