import { Loading } from "@spark/ui";
import { Nav, NoWebsite } from "~/components";

import { useActiveWebsite } from "~/hooks";
import { useRouter } from "next/router";
import { trpc } from "~/utils";

export default function Dashboard() {
  const [id] = useActiveWebsite();
  const query = trpc.website.all.useQuery();
  const router = useRouter();

  if (query.isLoading) {
    return <Loading />;
  }

  if (query.isError) {
    return <div>Failed to load websites</div>;
  }

  if (query.data.length === 0) {
    return (
      <div className="flex flex-col h-screen">
        <Nav />
        <NoWebsite />
      </div>
    );
  }

  if (id) {
    router.push(`/dashboard/${id}`);
    return;
  }

  if (query.data[0]?.id) {
    router.push(`/dashboard/${query.data[0].id}`);
    return;
  }
}
