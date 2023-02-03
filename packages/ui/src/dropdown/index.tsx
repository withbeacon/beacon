"use client";

import type { PropsWithChildren, ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface Props extends PropsWithChildren {
  trigger: ReactNode;
}

export function Dropdown({
  children,
  trigger,
}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mr-4 rounded-lg bg-gray-100 px-2 py-2 shadow-sm dark:bg-gray-800 pointer-events-none">
          <DropdownMenu.Label />
          <DropdownMenu.Item />

          <DropdownMenu.Group>
            <DropdownMenu.Item />
          </DropdownMenu.Group>

          {children}

          <DropdownMenu.Separator />
          <DropdownMenu.Arrow className="fill-gray-100 dark:fill-gray-800" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
