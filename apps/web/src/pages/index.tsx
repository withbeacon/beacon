import { Loading } from "@bud/ui";
import { Nav, NoWebsite } from "~/components";

import { useRouter } from "next/router";
import { useWebsite } from "~/store";
import { trpc } from "~/utils";

export default function Dashboard() {
  const [id] = useWebsite();
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
      <div className="flex h-screen flex-col">
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
