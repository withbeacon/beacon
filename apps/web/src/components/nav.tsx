import { Logo } from "@spark/ui";
import {
  SearchIcon,
  HelpIcon,
  MenuIcon,
  SelectIcon,
  SettingsIcon,
} from "@spark/ui";
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
    <nav className="flex items-center bg-gray-50 py-4 px-6 drop-shadow-sm justify-between">
      <div className="flex items-center text-gray-800 text-xl font-medium">
        <Logo className="w-10 h-10" />
        <span>Spark</span>

        {query.data && (
          <div className="flex items-center ml-3 gap-3">
            <div className="cursor-pointer items-center gap-3 hidden md:flex">
              <span>{"/"}</span>
              <img
                src={query.data.favicon || ""}
                alt={query.data.name}
                className="w-5 h-5"
              />
              <h2>{query.data.name}</h2>
              <WebsiteSelect>
                <SelectIcon className="w-5 h-5 -ml-1" />
              </WebsiteSelect>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-5">
        <SearchIcon aria-label="Search" className={baseIconStyles} />
        <SettingsIcon aria-label="Settings" className={baseIconStyles} />
        <Feedback>
          <HelpIcon aria-label="Help" className={baseIconStyles} />
        </Feedback>
        {data?.user && (
          <img
            className="rounded-full w-7 h-7"
            src={data?.user?.image || ""}
            alt={data?.user?.name || "Spark User"}
          />
        )}
      </div>

      <MobileMenu>
        <MenuIcon className={baseIconStyles} />
      </MobileMenu>
    </nav>
  );
}
