import type { PropsWithChildren } from "react";
import { HomeIcon, FileIcon } from "@beacon/ui";
import DateSelect from "~/components/dateSelect";
import Image from "next/image";
import Link from "next/link";
import SignInLinkButton from "./signInLinkButton";

interface Props {
  url: string;
  name: string;
  favicon: string | null;
  isAuthed: boolean;
}

export default function AnalyticsSidebar({
  favicon,
  name,
  url,
  isAuthed,
}: Props) {
  return (
    <>
      <div className="flex gap-4 overflow-hidden lg:hidden">
        <Image
          src={
            favicon ||
            "https://github.com/tailwindlabs/heroicons/raw/master/src/24/outline/globe-alt.svg"
          }
          alt={name}
          width={28}
          height={28}
        />

        <h2 className="truncate text-xl font-bold text-gray-800 dark:text-gray-100">
          {name}
        </h2>
      </div>

      <aside className="hidden min-h-full w-64 flex-col gap-4 bg-gray-100 pb-6 dark:bg-gray-900 lg:flex">
        <div className="flex gap-4">
          <Image
            src={
              favicon ||
              "https://github.com/tailwindlabs/heroicons/raw/master/src/24/outline/globe-alt.svg"
            }
            alt={name}
            width={28}
            height={28}
          />

          <div className="flex flex-col overflow-hidden">
            <h2 className="truncate text-xl font-bold text-gray-800 dark:text-gray-100">
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
