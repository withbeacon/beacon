import type { PropsWithChildren } from "react";
import { cx } from "class-variance-authority";

interface Props {
  className?: string;
  error?: string;
  htmlFor?: string;
}

export function Label({
  className,
  error,
  children,
  htmlFor,
}: PropsWithChildren<Props>) {
  return (
    <label
      className={cx(
        "block",
        error
          ? "text-red-500 dark:text-red-400"
          : "text-gray-700 dark:text-gray-300",
        className
      )}
      htmlFor={htmlFor}
    >
      {error ? error : children}
    </label>
  );
}
