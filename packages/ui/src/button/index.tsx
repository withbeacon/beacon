import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cva } from "class-variance-authority";

const buttonStyles = cva(
  "flex items-center justify-center gap-2 font-medium outline-none active:scale-[98%] active:shadow-sm transition-all duration-200 cursor-pointer",
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
      variant: {
        normal: "text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
        outline: "!border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
        primary:
          "bg-primary-500 text-gray-100 fill-gray-100 hover:bg-primary-600",
        destructive: "bg-red-500 text-gray-100 fill-gray-100 hover:bg-red-600",
      },
      defaultVariants: {
        variant: "normal",
        size: "md",
      },
    },
  }
);

interface Props extends VariantProps<typeof buttonStyles> {
  children: ReactNode;
  onClick?: JSX.IntrinsicElements["button"]["onClick"];
  className?: string;
  loading?: boolean;
  submit?: boolean;
  role?: JSX.IntrinsicElements["button"]["role"];
}

export function Button({
  loading = false,
  disabled = false,
  submit,
  variant,
  className,
  children,
  onClick,
  role,
  ...props
}: Props) {
  return (
    <button
      className={
        buttonStyles({ variant: variant, loading, disabled, ...props }) +
        " " +
        className
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
      <span>Hang on...</span>
    </>
  );
}
