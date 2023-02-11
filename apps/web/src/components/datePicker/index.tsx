"use client";

import type { CalendarDay } from "@rehookify/datepicker";
import { ChevronUpIcon, ChevronDownIcon } from "@beacon/ui";
import { Button } from "@beacon/ui";
import ButtonGroup from "./buttonGroup";

import { cx } from "class-variance-authority";
import { useState, useEffect } from "react";
import { useDate } from "~/store/date";
import {
  useCalendars,
  useDatePickerState,
  useDaysPropGetters,
  useMonthsPropGetters,
} from "@rehookify/datepicker";

interface Props {
  minDate: number | Date;
}

export default function DatePicker({ minDate }: Props) {
  minDate = new Date(minDate);

  const [date, setDate] = useDate();
  const [selectedDates, onDatesChange] = useState<Date[]>(
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

  useEffect(
    () =>
      setDate({
        from: selectedDates[0] || date.from,
        to: selectedDates[1] || date.to,
      }),
    [selectedDates]
  );

  return (
    <section className="absolute z-50 flex min-h-fit w-80 flex-wrap rounded-xl border-2 border-gray-200 bg-white p-4 dark:bg-gray-900">
      <header className="max-h-fit w-full">
        <ButtonGroup />
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
    </section>
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
