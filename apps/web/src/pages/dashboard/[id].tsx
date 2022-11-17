import { Nav, Stats } from "~/components";
import { Loading } from "@spark/ui";

import { useRouter } from "next/router";
import { trpc } from "~/utils";
import { useActiveWebsite } from "~/hooks";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const StatChart = dynamic(() => import("~/components/chart"), {
  loading: () => <p>loading</p>,
});

export default function Analytics() {
  const router = useRouter();
  const { id } = router.query;
  const query = trpc.website.get.useQuery(id as string);

  const [, setId] = useActiveWebsite();

  useEffect(() => {
    if (id === null || query.data === null) {
      return;
    }

    setId(id as string);
  }, [id]);

  if (query.isLoading) {
    return <Loading />;
  }

  if (query.isError) {
    if (query.error.data?.code === "NOT_FOUND") {
      router.push("/");
      return <></>;
    }

    return <div>Failed to load website</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <Stats />
      <StatChart />
    </div>
  );
}
