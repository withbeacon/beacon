import { Button } from "@beacon/ui";

import { cx } from "class-variance-authority";
import { fromNow } from "@beacon/basics";
import { useState, useEffect } from "react";
import { useDate } from "~/store";

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

type Props = {
  active: Option | null;
  setActive: (option: Option | null) => void;
}

export default function ButtonGroup({ active, setActive }: Props) {
  const [date, setDate] = useDate();

  function handleSelect(val: string) {
    setDate(options[val as Option]);
    setActive(val as Option);
  }

  const keybindings: Record<string, () => void> = {
    w: () => handleSelect("Past Week"),
    m: () => handleSelect("Past Month"),
    h: () => handleSelect("Past 6 Months"),
    y: () => handleSelect("Past Year"),
  };

  useEffect(() => {
    function keydown(evt: KeyboardEvent) {
      const key = evt.key;

      const fn = keybindings[key];

      if (typeof fn !== "undefined") {
        fn();
      }
    }

    window.addEventListener("keydown", keydown);

    return () => {
      window.removeEventListener("keydown", keydown);
    };
  }, [active]);

  return (
    <div className="hide-scrollbar mb-3 flex min-w-full gap-3 overflow-scroll">
      {Object.keys(options).map((option) => (
        <Button
          key={option}
          variant="outline"
          size="md"
          className="min-w-fit"
          onClick={() => handleSelect(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
