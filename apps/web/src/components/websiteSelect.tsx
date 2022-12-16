import type { PropsWithChildren } from "react";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from "@bud/ui";
import * as SelectPrimitive from "@radix-ui/react-select";

import { cx } from "class-variance-authority";
import { trpc } from "~/utils";
import { useRouter } from "next/router";
import { useWebsite } from "~/store";

export function WebsiteSelect({ children }: PropsWithChildren) {
  const [id, setId] = useWebsite();
  const router = useRouter();
  const query = trpc.website.all.useQuery().data || [];

  if (query.length === 0 || !query) {
    return null;
  }

  function handleSelectChange(value: string) {
    if (value === "add") {
      router.push(`/new`);
      return;
    }

    setId(value);
    router.push(`/dashboard/${value}`);
  }

  return (
    <SelectPrimitive.Root
      defaultValue={id || undefined}
      onValueChange={handleSelectChange}
    >
      <SelectPrimitive.Trigger asChild aria-label="Websites">
        {children}
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content>
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="z-50 rounded-lg bg-white p-2 shadow-xl dark:bg-gray-900">
          <SelectPrimitive.Group>
            {query?.map((website) => (
              <SelectPrimitive.Item
                disabled={website.id === id}
                key={website.id}
                value={website.id}
                className={cx(
                  "relative flex items-center rounded-md px-6 py-2 text-lg font-medium text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-900",
                  "radix-state-checked:bg-gray-200 dark:radix-state-checked:bg-gray-800",
                  "select-none focus:outline-none"
                )}
              >
                {website.favicon && (
                  <img src={website.favicon} className="mr-2 h-6 w-6" />
                )}
                <SelectPrimitive.ItemText>
                  {website.name}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
            <SelectPrimitive.Item
              key="add"
              value="add"
              className={cx(
                "relative flex items-center rounded-md px-6 py-2 text-lg font-medium text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-900",
                "radix-state-checked:bg-gray-200 dark:radix-state-checked:bg-gray-800",
                "select-none focus:outline-none"
              )}
            >
              <PlusIcon className="mr-2 h-6 w-6" />
              <SelectPrimitive.ItemText>Add website</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          </SelectPrimitive.Group>
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
}
