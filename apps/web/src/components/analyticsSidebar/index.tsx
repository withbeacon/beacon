import type { PropsWithChildren } from "react";
import { HomeIcon, FileIcon, CalendarIcon } from "@beacon/ui";
import Link from "next/link";
import SignInLinkButton from "./signInLinkButton";

import useWebsiteStore from "~/store/website";
import DatePicker from "../datePicker";

interface Props {
  isAuthed: boolean;
}

export default function AnalyticsSidebar({ isAuthed }: Props) {
  const { url, name, minDate } = useWebsiteStore.getState();

  return (
    <>
      <nav className="flex justify-between px-2 items-center">
        <div className="flex gap-4 overflow-hidden lg:hidden items-center">
          <div>
            <img src={`/favicon/${url}`} alt={name} width={28} height={28} className="aspect-square rounded" />
          </div>

          <h2 className="truncate text-xl font-bold text-gray-800 dark:text-gray-100">
            {name}
          </h2>
        </div>

        <DatePicker minDate={minDate} />
      </nav>

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
            <Link
              href={"http://" + url}
              target="_blank"
              className="text-sm text-gray-500 dark:text-gray-400 truncate"
            >
              {url}
            </Link>
          </div>
        </div>

        <DatePicker minDate={minDate} />

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
export function AnalyticsSidebarShimmer() {
  return (
    <aside className="fixed hidden h-screen w-64 flex-col gap-4 bg-gray-100 pr-6 pb-12 dark:bg-gray-900 lg:flex">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-gray-300 dark:bg-gray-700" />

        <h2 className="truncate text-xl font-bold text-gray-800 dark:text-gray-100">
          Hang on...
        </h2>
      </div>

      <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 dark:border-gray-700">
        <CalendarIcon />
        Past Week
      </div>

      <div className="mt-auto flex flex-col gap-6">
        <SidebarLink href="/">
          <HomeIcon />
          <span>Dashboard</span>
        </SidebarLink>

        <SidebarLink href="#">
          <FileIcon />
          <span>Documentation</span>
        </SidebarLink>
      </div>
    </aside>
  );
}
