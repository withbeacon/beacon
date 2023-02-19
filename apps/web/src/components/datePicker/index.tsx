"use client";

import type { PropsWithChildren } from "react";
import type { CalendarDay } from "@rehookify/datepicker";
import { ChevronUpIcon, ChevronDownIcon, CalendarIcon } from "@beacon/ui";
import { Button } from "@beacon/ui";
import ButtonGroup from "./buttonGroup";
import * as Popover from "@radix-ui/react-popover";

import { cx } from "class-variance-authority";
import { useState, useEffect } from "react";
import { useDate } from "~/store/date";
import {
  useCalendars,
  useDatePickerState,
  useDaysPropGetters,
  useMonthsPropGetters,
} from "@rehookify/datepicker";
import { fromNow } from "@beacon/basics";

interface Props extends PropsWithChildren {
  minDate: number | Date;
}

type Option = "Past Week" | "Past Month" | "Past 6 Months" | "Past Year";

const options = {
  "Past Week": {
    from: fromNow(7),
    to: fromNow(),
  },
  "Past Month": {
    from: fromNow(30),
    to: fromNow(),
  },
  "Past 6 Months": {
    from: fromNow(183),
    to: fromNow(),
  },
  "Past Year": {
    from: fromNow(365),
    to: fromNow(),
  },
} as const;

export default function DatePicker({ children, minDate }: Props) {
  minDate = new Date(minDate);

  const [date, setDate] = useDate();
  const [active, setActive] = useState<Option | null>("Past Week");
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    date ? [date.from, date.to] : []
  );
  const datePickerState = useDatePickerState({
    selectedDates,
    onDatesChange,
    dates: { toggle: true, mode: "range", maxDate: new Date(), minDate },
  });

  const { dayButton } = useDaysPropGetters(datePickerState);
  const { nextMonthButton, previousMonthButton } =
    useMonthsPropGetters(datePickerState);

  const { calendars, weekDays } = useCalendars(datePickerState);
  const { year, month, days } = calendars[0] as NonNullable<
    typeof calendars[0]
  >;

  function onDatesChange(d: Date[]) {
    setSelectedDates(d);
    setActive(null);
  }

  const format = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });

  useEffect(
    () =>
      setDate({
        from: selectedDates[0] || date.from,
        to: selectedDates[1] || date.to,
      }),
    [selectedDates]
  );

  return (
    <Popover.Root modal>
      <Popover.Trigger className="flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 px-4 py-2.5 font-medium transition-all duration-200 active:scale-[98%] active:shadow-sm dark:border-gray-800">
        <CalendarIcon />
        {active ? active : format.formatRange(date.from, date.to)}
      </Popover.Trigger>
      <Popover.Portal className="border-none outline-none">
        <Popover.Content className="top-3 z-50 flex min-h-fit w-80 flex-wrap rounded-xl border-2 border-gray-200 bg-white p-4 outline-none dark:bg-gray-900 mt-3 mx-8 lg:mx-6" data-align="center" data-side="bottom">
          <header className="max-h-fit w-full">
            <ButtonGroup active={active} setActive={setActive} />
            <div className="flex w-full items-center justify-between">
              <Button
                className="rounded-lg border border-gray-200 px-2 py-2 dark:border-gray-800"
                {...previousMonthButton()}
              >
                <ChevronDownIcon className="h-4 w-4 rotate-90" />
              </Button>
              <p className="text-lg font-medium">
                {month} {year}
              </p>
              <Button
                className="rounded-lg border border-gray-200 px-2 py-2 dark:border-gray-800"
                {...nextMonthButton()}
              >
                <ChevronUpIcon className="h-4 w-4 rotate-90" />
              </Button>
            </div>
            <ul className="grid-rows-auto mt-1 grid grid-cols-7">
              {weekDays.map((day) => (
                <li
                  className="w-full p-2 text-center text-gray-700 dark:text-gray-400"
                  key={`${month}-${day}`}
                >
                  {day}
                </li>
              ))}
            </ul>
          </header>
          <div className="grid-rows-auto grid w-full grid-cols-7 gap-y-2">
            {days.map((dpDay) => (
              <button
                className={getClassName(dpDay)}
                key={+dpDay.$date}
                {...dayButton(dpDay)}
              >
                {dpDay.day}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function getClassName(day: CalendarDay): string {
  return cx(
    "w-full px-1.5 py-1.5",

    day.inCurrentMonth
      ? "text-gray-900 dark:text-gray-100"
      : "text-gray-700 dark:text-gray-400",

    day.disabled === true ? "cursor-not-allowed opacity-50" : "",

    day.range === "in-range"
      ? "bg-gray-200 dark:bg-gray-700"
      : day.range === "will-be-in-range"
      ? "border-gray-700 border"
      : day.range === "will-be-range-start"
      ? "rounded-l-md border border-gray-700"
      : day.range === "will-be-range-end"
      ? "rounded-r-md border border-gray-700"
      : day.range === "range-start"
      ? "rounded-l-md bg-gray-200 dark:bg-gray-700"
      : day.range === "range-end"
      ? "rounded-r-md bg-gray-200 dark:bg-gray-700"
      : ""
  );
}
