import type { PropsWithChildren } from "react";

export function MetricsContainer({ children }: PropsWithChildren) {
  return (
    <div className="hide-scrollbar flex h-96 w-full flex-col gap-4 overflow-y-scroll rounded-xl border border-gray-200 bg-white px-5 py-4 text-gray-800 shadow-xl shadow-gray-100">
      {children}
    </div>
  );
}
