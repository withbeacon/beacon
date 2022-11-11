import { Logo, MenuIcon } from "@spark/ui";
import { SearchIcon, HelpIcon } from "@spark/ui";
import { MobileMenu } from "~/components";
import { Feedback } from "~/components/widgets";

import { useSession } from "next-auth/react";

export function Nav() {
  const { data } = useSession();
  const baseIconStyles =
    "w-6 h-6 hover:opacity-90 cursor-pointer text-gray-800";

  return (
    <nav className="flex items-center bg-gray-50 py-4 px-6 drop-shadow-sm justify-between">
      <div className="flex items-center">
        <Logo className="text-gray-800 w-12 h-12" />
        <span className="text-gray-800 text-2xl font-semibold">Spark</span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <SearchIcon className={baseIconStyles} />

        <Feedback>
          <HelpIcon className={baseIconStyles} />
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
