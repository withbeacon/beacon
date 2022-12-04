import { Logo } from "@bud/ui";
import {
  SearchIcon,
  HelpIcon,
  MenuIcon,
  UserIcon,
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
    "w-6 h-6 hover:opacity-90 cursor-pointer text-gray-800 dark:text-gray-200";

  if (query.isLoading) return <></>;

  return (
    <nav className="flex items-center justify-between bg-gray-50 py-4 px-6 drop-shadow-sm dark:bg-gray-900">
      <div className="flex items-center gap-2 text-xl font-medium text-gray-800 dark:text-gray-200">
        <Logo className="h-6 w-6" />
        <span>Bud</span>

        {query.data && (
          <div className="ml-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <div className="hidden cursor-pointer items-center gap-2 md:flex">
              <span className="mr-2 text-gray-500 dark:text-gray-600">
                {"/"}
              </span>
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
        <picture>
          <source srcSet={data?.user?.image || ""} />
          <UserIcon aria-label="Settings" className={baseIconStyles + " -ml-1"} />
        </picture>
      </div>

      <MobileMenu>
        <MenuIcon className={baseIconStyles} />
      </MobileMenu>
    </nav>
  );
}
