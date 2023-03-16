"use client";
import AddDialog from "~/components/addDialog";
import { Button } from "@beacon/ui";
import { PlusIcon } from "@beacon/ui";

import { useState } from "react";

export default function AddWebsiteButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="md"
        className="rounded-xl"
        fullWidth
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon />
        Add new site
      </Button>

      <AddDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
