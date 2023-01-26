import type { PropsWithChildren } from "react";
import { HomeIcon, FileIcon } from "@beacon/ui";
import DateSelect from "~/components/dateSelect";
import Link from "next/link";
import SignInLinkButton from "./signInLinkButton";

import useWebsiteStore from "~/store/website";

interface Props {
  isAuthed: boolean;
}

export default function AnalyticsSidebar({ isAuthed }: Props) {
  const url = useWebsiteStore.getState().url;
  const name = useWebsiteStore.getState().name;

  return (
    <>
      <div className="flex gap-4 overflow-hidden lg:hidden">
        <img src={`/favicon/${url}`} alt={name} width={28} height={28} />

        <h2 className="truncate text-xl font-bold text-gray-800 dark:text-gray-100">
          {name}
        </h2>
      </div>

      <aside className="fixed hidden h-screen w-64 flex-col gap-4 bg-gray-100 pr-6 pb-12 dark:bg-gray-900 lg:flex">
        <div className="flex gap-4">
          <img
            src={`/favicon/${url}`}
            alt={name}
            width={28}
            height={28}
            className="h-8 w-8 rounded-md"
          />

          <div className="flex flex-col overflow-hidden">
            <h2 className="-mt-1 truncate text-xl font-bold text-gray-800 dark:text-gray-100">
              {name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{url}</p>
          </div>
        </div>

        <DateSelect />

        <div className="mt-auto flex flex-col gap-6">
          {isAuthed ? (
            <>
              <SidebarLink href="/">
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarLink>

              <SidebarLink href="#">
                <FileIcon />
                <span>Documentation</span>
              </SidebarLink>
            </>
          ) : (
            <SignInLinkButton />
          )}
        </div>
      </aside>
    </>
  );
}

interface SidebarLinkProps extends PropsWithChildren {
  href: string;
}

function SidebarLink({ href, children }: SidebarLinkProps) {
  return (
    <Link href={href} className="flex gap-2 text-gray-700 dark:text-gray-300">
      {children}
    </Link>
  );
}
