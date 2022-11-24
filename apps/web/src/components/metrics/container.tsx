import type { PropsWithChildren } from "react";

export function MetricsContainer({ children }: PropsWithChildren) {
  return (
    <div className="relative flex flex-col gap-4 px-5 py-4 rounded-xl bg-white text-gray-800 border border-gray-200 shadow-xl shadow-gray-100 w-full h-96 overflow-y-scroll hide-scrollbar">
      {children}
    </div>
  );
}

