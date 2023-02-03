"use client";

import type { PropsWithChildren } from "react";
import { LogoutIcon } from "@beacon/ui";
import { Dropdown, Dialog, Button } from "@beacon/ui";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SettingsDropdown({ children }: PropsWithChildren) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Dropdown trigger={children}>
        <DropdownMenu.Group className="z-[99] flex w-40 flex-col gap-4 p-0.5">
          <DropdownMenu.Item
            className="flex cursor-pointer gap-2 outline-none"
            onClick={() => setIsDialogOpen(true)}
          >
            <LogoutIcon /> Logout
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </Dropdown>
      <Dialog
        isOpen={isDialogOpen}
        setIsOpen={() => setIsDialogOpen(true)}
        title="Logout of Beacon"
        description="Are you sure you want to logout? Don't worry, you can always login again."
      >
        <div className="flex justify-end">
          <Button
            onClick={() => setIsDialogOpen(false)}
            intent="outline"
            size="sm"
            className="w-full md:w-auto"
          >
            Cancel
          </Button>

          <Button
            onClick={() => signOut()}
            intent="primary"
            size="sm"
            className="w-full md:w-auto"
            filled
          >
            Logout
          </Button>
        </div>
      </Dialog>
    </>
  );
}
