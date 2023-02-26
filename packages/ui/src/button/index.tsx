import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cva } from "class-variance-authority";

const buttonStyles = cva(
  "flex items-center justify-center gap-2 font-medium outline-none active:scale-[98%] active:shadow-sm transition-all duration-200",
  {
    variants: {
      fullWidth: {
        true: "w-full",
      },
      disabled: {
        true: "opacity-80 cursor-not-allowed",
      },
      loading: {
        true: "opacity-80 cursor-progress",
      },
      size: {
        sm: "px-4 py-2 rounded-lg",
        md: "px-5 py-2.5 text-base rounded-xl",
        lg: "px-8 py-2.5 text-lg rounded-2xl",
      },
      intent: {
        normal: "text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        primary: "text-primary-500 dark:text-primary-400",
        destructive: "text-red-500 dark:text-gray-400",
        outline: "!border border-gray-200 dark:border-gray-800",
        "normal-filled":
          "bg-gray-200 text-gray-800 fill-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:fill-gray-200",
        "primary-filled":
          "bg-primary-500 text-gray-100 fill-gray-100 dark:bg-primary-400",
        "destructive-filled":
          "bg-red-500 text-gray-100 fill-gray-100 dark:bg-red-400",
        "primary-tinted":
          "bg-primary-200 text-primary-500 fill-primary-500 dark:text-primary-400 dark:fill-primary-400 dark:bg-primary-100",
        "destructive-tinted":
          "bg-red-200 text-red-500 fill-red-500 dark:bg-red-200 dark:text-red-400 dark:fill-red-400",
      },
      defaultVariants: {
        intent: "normal",
        size: "md",
      },
    },
  }
);

interface Props extends VariantProps<typeof buttonStyles> {
  children: ReactNode;
  onClick?: JSX.IntrinsicElements["button"]["onClick"];
  className?: string;
  tinted?: boolean;
  filled?: boolean;
  loading?: boolean;
  submit?: boolean;
  role?: JSX.IntrinsicElements["button"]["role"];
}

export function Button({
  tinted = false,
  filled = false,
  loading = false,
  disabled = false,
  submit,
  intent,
  className,
  children,
  onClick,
  role,
  ...props
}: Props) {
  if (tinted) {
    intent = (intent + "-tinted") as Props["intent"];
  }

  if (filled) {
    intent = (intent + "-filled") as Props["intent"];
  }

  return (
    <button
      className={
        buttonStyles({ intent, loading, disabled, ...props }) + " " + className
      }
      onClick={loading || disabled ? undefined : onClick}
      role={role}
      disabled={disabled || loading}
      type={submit ? "submit" : "button"}
    >
      {loading ? <Loading /> : children}
    </button>
  );
}

function Loading() {
  return (
    <>
      <svg
        className="h-5 w-5 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Just a second...</span>
    </>
  );
}
