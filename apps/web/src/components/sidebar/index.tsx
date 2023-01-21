import type { PropsWithChildren } from "react";
import { HelpIcon, FileIcon } from "@beacon/ui";
import Link from "next/link";
import AddWebsiteButton from "./addButton";

interface Props {
  user: {
    name: string;
    image: string | null | undefined;
  };
}

export default function Sidebar({ user }: Props) {
  return (
    <aside className="hidden min-h-full w-64 flex-col gap-4 bg-gray-100 pb-6 dark:bg-gray-900 lg:flex">
      <div className="flex gap-4 items-center">
        <img
          src={
            user.image ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`
          }
          alt={user.name}
          width={32}
          height={32}
          className="rounded-lg"
        />

        <h2 className="truncate text-xl font-medium text-gray-800 dark:text-gray-100">
          {user.name}
        </h2>
      </div>

      <AddWebsiteButton/>

      <div className="mt-auto flex flex-col gap-6">
        <SidebarLink href="/">
          <HelpIcon />
          <span>Help & Support</span>
        </SidebarLink>

        <SidebarLink href="#">
          <FileIcon />
          <span>Documentation</span>
        </SidebarLink>
      </div>
    </aside>
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