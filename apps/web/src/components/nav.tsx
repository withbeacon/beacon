import { SearchIcon, HelpIcon, MenuIcon, UserIcon, SelectIcon } from "@bud/ui";
import { MobileMenu, DateSelect, WebsiteSelect } from "~/components";
import { SettingsDropdown } from "./settingsDropdown";
import { Feedback } from "~/components/widgets";
import { Button, Logo } from "@bud/ui";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDate } from "~/store";
import { trpc } from "~/utils";

interface Props {
  shared?: boolean;
}

function Website() {
  const router = useRouter();
  const { id } = router.query;
  const [date] = useDate();

  const query = trpc.website.get.useQuery({
    id: id as string,
    from: date.from,
    to: date.to,
  });

  return (
    <>
      {query.data && (
        <div className="ml-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <div className="hidden cursor-pointer items-center gap-2 md:flex">
            <span className="mr-2 text-gray-500 dark:text-gray-700">{"/"}</span>
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
    </>
  );
}

export function Nav({ shared = false }: Props) {
  const { data } = useSession();
  const { push, query } = useRouter();

  const baseIconStyles =
    "w-6 h-6 hover:opacity-90 cursor-pointer text-gray-800 dark:text-gray-200";

  return (
    <nav className="mx-6 flex items-center justify-between border-b border-gray-200 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 text-xl font-medium text-gray-800 dark:text-gray-200">
        <Logo className="h-6 w-6" />
        <span>Bud</span>
        <Website />
      </div>

      <div className="hidden items-center gap-4 md:flex">
        {query.id && (
          <DateSelect />
        )}
        <SearchIcon aria-label="Search" className={baseIconStyles} />
        <Feedback>
          <HelpIcon aria-label="Help" className={baseIconStyles} />
        </Feedback>
        {shared && (
          <Button
            onClick={() => push("/sign-in")}
            intent="primary"
            size="sm"
            className="!px-6"
            filled
          >
            Sign In
          </Button>
        )}
        {!shared && (
          <SettingsDropdown>
            <picture>
              <source srcSet={data?.user?.image || ""} />
              <UserIcon
                aria-label="Settings"
                className={baseIconStyles + " -ml-1"}
              />
            </picture>
          </SettingsDropdown>
        )}
      </div>

      <MobileMenu shared>
        <MenuIcon className={baseIconStyles} />
      </MobileMenu>
    </nav>
  );
}
