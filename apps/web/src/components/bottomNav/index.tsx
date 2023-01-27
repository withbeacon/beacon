"use client";

import type { PropsWithChildren } from "react";
import { HomeIcon, PlusIcon, UserIcon } from "@beacon/ui";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { cx } from "class-variance-authority";
import AddDialog from "../addDialog";

interface Props extends PropsWithChildren {
  href: string;
}

function NavItem({ href, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={cx(
        "flex flex-col items-center justify-start",
        isActive ? "-mb-1" : null
      )}
      href={href}
    >
      {children}
      {isActive && (
        <div className="bottom-0 mt-1 h-0.5 w-1/2 rounded-full bg-gray-800 dark:bg-gray-100" />
      )}
    </Link>
  );
}

export default function BottomNav() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center gap-6 border-t border-gray-200 bg-white py-4 shadow-lg shadow-gray-900/10 dark:border-gray-800 dark:shadow-gray-900/10 lg:hidden z-40">
      <NavItem href="/">
        <HomeIcon />
      </NavItem>
      <button className="flex flex-col items-center justify-center" onClick={() => setIsDialogOpen(true)}>
        <PlusIcon />
      </button>
      <NavItem href="/settings">
        <UserIcon />
      </NavItem>

      <AddDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </nav>
  );
}

export function BottomNavShimmer() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-center gap-6 border-t border-gray-200 bg-gray-900 py-4 shadow-lg shadow-gray-900/10 dark:border-gray-800 dark:shadow-gray-900/10 lg:hidden z-40">
      <div className="flex flex-col items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse" />
      </div>
    </nav>
  );
}

