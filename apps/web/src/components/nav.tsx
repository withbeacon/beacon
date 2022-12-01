import { Logo } from "@bud/ui";
import {
  SearchIcon,
  HelpIcon,
  MenuIcon,
  SelectIcon,
  SettingsIcon,
} from "@bud/ui";
import { MobileMenu, WebsiteSelect } from "~/components";
import { Feedback } from "~/components/widgets";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "~/utils";

export function Nav() {
  const router = useRouter();
  const { data } = useSession();
  const { id } = router.query;
  const query = trpc.website.get.useQuery(id as string);

  const baseIconStyles =
    "w-6 h-6 hover:opacity-90 cursor-pointer text-gray-800";

  if (query.isLoading) return <></>;

  return (
    <nav className="flex items-center justify-between bg-gray-50 py-4 px-6 drop-shadow-sm">
      <div className="flex items-center text-xl font-medium text-gray-800">
        <Logo className="h-10 w-10" />
        <span>Bud</span>

        {query.data && (
          <div className="ml-3 flex items-center gap-3">
            <div className="hidden cursor-pointer items-center gap-3 md:flex">
              <span>{"/"}</span>
              <img
                src={query.data.favicon || ""}
                alt={query.data.name}
                className="h-5 w-5"
              />
              <h2>{query.data.name}</h2>
              <WebsiteSelect>
                <SelectIcon className="-ml-1 h-5 w-5" />
              </WebsiteSelect>
            </div>
          </div>
        )}
      </div>

      <div className="hidden items-center gap-5 md:flex">
        <SearchIcon aria-label="Search" className={baseIconStyles} />
        <SettingsIcon aria-label="Settings" className={baseIconStyles} />
        <Feedback>
          <HelpIcon aria-label="Help" className={baseIconStyles} />
        </Feedback>
        {data?.user && (
          <img
            className="h-7 w-7 rounded-full"
            src={data?.user?.image || ""}
            alt={data?.user?.name || "Bud User"}
          />
        )}
      </div>

      <MobileMenu>
        <MenuIcon className={baseIconStyles} />
      </MobileMenu>
    </nav>
  );
}
