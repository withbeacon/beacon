"use client";

import { SettingsIcon, HomeIcon, CommandDialog } from "@beacon/ui";
import { Prisma } from "@prisma/client";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@beacon/ui";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  websites?:
    | Prisma.WebsiteGetPayload<{
        select: {
          name: true;
          url: true;
          id: true;
        };
      }>[];
};

export default function CommandPalette({ websites }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (evt: KeyboardEvent) => {
      if (evt.key === "k" && (evt.metaKey || evt.ctrlKey)) {
        evt.preventDefault();
        setOpen((open) => !open);
      }
    };

    const pinch = (evt: TouchEvent) => {
      evt.preventDefault();

      if (evt.touches.length === 2) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    document.addEventListener("touchstart", pinch);

    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {websites && (
          <CommandGroup heading="Your websites">
            {websites.map((website) => (
              <CommandItem
                key={website.id}
                className="flex items-center gap-2"
                onSelect={() => navigate(`/${website.id}`)}
              >
                <img
                  src={`/favicon/${website.url}`}
                  width={64}
                  height={64}
                  alt={website.id}
                  className="mr-2 h-6 w-6 rounded-full"
                />
                {website.name}
              </CommandItem>
            ))}
            <CommandSeparator />
          </CommandGroup>
        )}
        <CommandGroup heading="Go to">
          <CommandItem
            onSelect={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <HomeIcon />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => navigate("/settings")}
            className="flex items-center gap-2"
          >
            <SettingsIcon />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
