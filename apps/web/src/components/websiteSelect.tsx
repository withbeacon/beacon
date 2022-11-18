import type { PropsWithChildren } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@spark/ui";
import * as SelectPrimitive from "@radix-ui/react-select";

import { cx } from "class-variance-authority";
import { trpc } from "~/utils";
import { useRouter } from "next/router";
import { useActiveWebsite } from "~/hooks";

export function WebsiteSelect({ children }: PropsWithChildren) {
  const query = trpc.website.all.useQuery().data || [];
  const router = useRouter();
  const [active, setActive] = useActiveWebsite();

  function handleSelectChange(value: string) {
    setActive(value);
    router.push(`/dashboard/${value}`);
  }

  return (
    <SelectPrimitive.Root
      defaultValue={active || undefined}
      onValueChange={handleSelectChange}
    >
      <SelectPrimitive.Trigger asChild aria-label="Websites">
        {children}
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content>
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="bg-white p-2 rounded-lg shadow-lg z-50">
          <SelectPrimitive.Group>
            {query?.map((website) => (
              <SelectPrimitive.Item
                disabled={website.id === active}
                key={website.id}
                value={website.id}
                className={cx(
                  "relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 font-medium focus:bg-gray-100",
                  "radix-state-checked:bg-gray-200",
                  "focus:outline-none select-none"
                )}
              >
                {website.favicon && (
                  <img src={website.favicon} className="w-6 h-6 mr-2" />
                )}
                <SelectPrimitive.ItemText>
                  {website.name}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
}
