"use client";

// Inspired from vercel calendar component

import type { PropsWithChildren } from "react";
import { CalendarIcon, CheckIcon } from "@beacon/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@beacon/ui";

import { cx } from "class-variance-authority";
import { useState, useEffect } from "react";
import { useDate } from "~/store/date";
import { fromNow } from "@beacon/basics";
import * as chrono from "chrono-node";

interface Props {
  minDate: number | Date;
}

type Option = "Past Week" | "Past Month" | "Past 6 Months" | "Past Year";

const options = [
  {
    label: "Past Week",
    from: fromNow(7),
    to: fromNow(),
  },
  {
    label: "Past Month",
    from: fromNow(30),
    to: fromNow(),
  },
  {
    label: "Past 6 Months",
    from: fromNow(183),
    to: fromNow(),
  },
  {
    label: "Past Year",
    from: fromNow(365),
    to: fromNow(),
  },
] as const;

export default function DatePicker({ minDate }: Props) {
  minDate = new Date(minDate);
  
  const [date, setDate] = useDate();
  const [active, setActive] = useState<Option | null>("Past Week");
  const [inputValue, setInputValue] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    date ? [date.from, date.to] : []
  );

  const [open, setOpen] = useState(false);

  const format = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });

  function onCustomRange() {
    const parsed = parseNlpDateRange(inputValue);

    if (parsed && parsed[0] && parsed[1]) {
      if (parsed[0] < minDate) {
        parsed[0] = new Date(minDate);
      } else if (parsed[1] > new Date()) {
        parsed[1] = new Date();
      }

      setSelectedDates(parsed);
      setActive(null);
      setInputValue("");
      setOpen(false);
    }
  }

  useEffect(
    () =>
      setDate({
        from: selectedDates[0] || date.from,
        to: selectedDates[1] || date.to,
      }),
    [selectedDates]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center justify-center gap-2 rounded-lg border border-gray-100 px-4 py-2 transition-all duration-300 active:scale-[98%] dark:border-gray-800">
        <CalendarIcon className="h-5 w-5" />
        <span className="text-sm lg:text-base truncate w-full overflow-hidden">
          {active ? active : format.formatRange(date.from, date.to)}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="ml-6 !p-0"
        sideOffset={8}
        align="end"
        side="bottom"
      >
        <Command>
          <CommandInput
            placeholder="Select Date Range"
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                onCustomRange();
              }
            }}
          />
          <CommandEmpty>
            <button className="w-full" onClick={onCustomRange}>
              <span className="relative mx-2 flex cursor-default select-none items-center rounded-md bg-gray-100 py-1.5 px-2 text-sm font-medium outline-none dark:bg-gray-700">
                {inputValue}
              </span>
            </button>
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.label}
                value={option.label}
                onSelect={() => {
                  setActive(option.label);
                  setSelectedDates([option.from, option.to]);
                }}
                onClick={() => {
                  setActive(option.label);
                  setOpen(false);
                }}
              >
                <>
                  <CheckIcon
                    className={cx(
                      "mr-2 h-4 w-4",
                      active === option.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function parseNlpDateRange(s: string): Date[] | null {
  const parsed = chrono.parse(s);

  if (parsed[0]) {
    return [parsed[0].start.date(), parsed[0]?.end?.date() || new Date()];
  }

  return null;
}
