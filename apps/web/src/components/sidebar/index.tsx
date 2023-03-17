import type { PropsWithChildren } from "react";
import {
  HelpIcon,
  FileIcon,
  SettingsIcon,
  ChevronUpIcon,
  StarIcon,
} from "@beacon/ui";
import Link, { LinkProps } from "next/link";
import AddWebsiteButton from "./addButton";

import { cx } from "class-variance-authority";

type Props = {
  user: {
    name: string;
    image: string | null | undefined;
    email: string;
  };
  page?: "dashboard" | "settings";
  isPro?: boolean;
};

export default function Sidebar({
  user,
  page = "dashboard",
  isPro = false,
}: Props) {
  return (
    <aside className="hidden min-h-full w-64 cursor-default flex-col gap-4 bg-gray-100 dark:bg-gray-900 lg:flex">
      {page === "dashboard" ? (
        <>
          <div className="group relative flex items-center gap-4">
            <img
              src={
                user.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
              }
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full"
            />

            <h2 className="truncate text-xl font-medium text-gray-800 dark:text-gray-100">
              {user.name}
            </h2>

            <Link
              href="/settings"
              className="absolute right-0 hidden cursor-default rounded-lg bg-gray-100 p-2 group-hover:block dark:bg-gray-800"
            >
              <SettingsIcon className="h-6 w-6" />
            </Link>
          </div>

          <AddWebsiteButton />
        </>
      ) : (
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-100 py-2.5 px-4 text-base font-medium text-gray-800 dark:border-gray-800 dark:text-gray-100"
        >
          <ChevronUpIcon className="h-6 w-5 -rotate-90" />
          <span>Back to Dashboard</span>
        </Link>
      )}

      <div className="mt-auto flex flex-col gap-6">
        <SidebarLink
          href={
            isPro
              ? ""
              : "https://beacon.lemonsqueezy.com/checkout/buy/f1807aef-3f25-4756-b918-cf12249e6a2e"
          }
        >
          <StarIcon />
          <span>{isPro ? "Pro Activated" : "Activate Pro"}</span>
        </SidebarLink>

        <SidebarLink href="/" disabled>
          <HelpIcon />
          <span>Help & Support</span>
        </SidebarLink>

        <SidebarLink href="#" disabled>
          <FileIcon />
          <span>Documentation</span>
        </SidebarLink>
      </div>
    </aside>
  );
}

type SidebarLinkProps = {
  disabled?: boolean;
} & PropsWithChildren &
  LinkProps;

function SidebarLink({
  children,
  disabled = false,
  ...props
}: SidebarLinkProps) {
  return (
    <Link
      className={cx(
        "flex gap-2 text-gray-700 dark:text-gray-300",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      )}
      title="Coming soon"
      {...props}
    >
      {children}
    </Link>
  );
}

export function SidebarShimmer() {
  return (
    <aside className="hidden min-h-full w-64 flex-col gap-4 bg-gray-100 pb-6 dark:bg-gray-900 lg:flex">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 animate-pulse rounded-full bg-gray-300" />

        <div className="h-6 w-32 animate-pulse bg-gray-300" />
      </div>

      <div className="mt-auto flex flex-col gap-6">
        <div className="flex gap-3 text-gray-700 dark:text-gray-300">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300" />
          <div className="h-6 w-32 animate-pulse bg-gray-300" />
        </div>

        <div className="flex gap-3 text-gray-700 dark:text-gray-300">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300" />
          <div className="h-6 w-32 animate-pulse bg-gray-300" />
        </div>
      </div>
    </aside>
  );
}
