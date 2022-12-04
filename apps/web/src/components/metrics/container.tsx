import type { PropsWithChildren } from "react";

export function MetricsContainer({ children }: PropsWithChildren) {
  return (
    <div className="hide-scrollbar flex h-96 w-full flex-col gap-4 overflow-y-scroll rounded-xl p-4 text-gray-800 dark:text-gray-200 bg-transparent">
      {children}
    </div>
  );
}
