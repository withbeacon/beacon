import type { PropsWithChildren } from "react";
import { SignOutIcon } from "@bud/ui";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { signOut } from "next-auth/react";

export function SettingsDropdown({ children }: PropsWithChildren) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {children}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-gray-100 dark:bg-gray-800 shadow-sm px-4 py-2 rounded-lg mr-4">
          <DropdownMenu.Label />
          <DropdownMenu.Item />

          <DropdownMenu.Group>
            <DropdownMenu.Item />
          </DropdownMenu.Group>

          <DropdownMenu.RadioGroup>
            <DropdownMenu.RadioItem value="sign-out">
              <button className="flex gap-2 items-center justify-center" onClick={() => signOut()}>
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
