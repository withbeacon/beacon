"use client";
import Link from "next/link";
import { Button } from "@beacon/ui";
import { PlusIcon } from "@beacon/ui";

export default function AddWebsiteButton() {
  return (
    <Link href="/add">
      <Button intent="outline" size="md" className="rounded-xl" fullWidth>
        <PlusIcon />
        Add new site
      </Button>
    </Link>
  );
}
