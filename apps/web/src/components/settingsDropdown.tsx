"use client";

import type { ReactNode } from "react";
import { SignOutIcon, UserIcon } from "@bud/ui";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { signOut } from "next-auth/react";

interface Props {
  children?: ReactNode;
}

export default function SettingsDropdown({
  children = (
    <UserIcon className="h-6 w-6 cursor-pointer text-gray-800 hover:opacity-90 dark:text-gray-200" />
  ),
}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mr-4 rounded-lg bg-gray-100 px-4 py-2 shadow-sm dark:bg-gray-800">
          <DropdownMenu.Label />
          <DropdownMenu.Item />

          <DropdownMenu.Group>
            <DropdownMenu.Item />
          </DropdownMenu.Group>

          <DropdownMenu.RadioGroup>
            <DropdownMenu.RadioItem value="sign-out">
              <button
                className="flex items-center justify-center gap-2 text-gray-800 dark:text-gray-200"
                onClick={() => signOut()}
              >
                <SignOutIcon /> Sign out
              </button>
              <DropdownMenu.ItemIndicator />
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator />
          <DropdownMenu.Arrow className="fill-gray-100 dark:fill-gray-800" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
