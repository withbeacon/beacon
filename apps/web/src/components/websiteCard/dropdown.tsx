"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import RenameDialog from "./renameDialog";
import DeleteDialog from "./deleteDialog";
import { Dropdown, Button } from "@beacon/ui";
import { EllipsisIcon } from "@beacon/ui";

import { useState } from "react";

interface Props {
  name: string;
  id: string;
}

export default function CardDropdown({ name, id }: Props) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Dropdown
        trigger={
          <EllipsisIcon className="h-6 w-6 text-gray-700 group-hover:block group-active:block radix-state-open:hidden dark:text-gray-300 hidden" />
        }
      >
        <DropdownMenu.Group className="z-[99] flex flex-col gap-4 p-1">
          <DropdownMenu.Item>
            <button onClick={() => setIsRenameDialogOpen(true)}>
              Rename
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item>
            <button onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </Dropdown>

      <RenameDialog
        name={name}
        id={id}
        isOpen={isRenameDialogOpen}
        setIsOpen={setIsRenameDialogOpen}
      />

      <DeleteDialog
        name={name}
        id={id}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
