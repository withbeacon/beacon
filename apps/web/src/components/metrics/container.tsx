import type { PropsWithChildren } from "react";

export function MetricsContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4 px-5 py-4 rounded-xl bg-white text-gray-800 border border-gray-200 shadow-xl shadow-gray-100 md:w-1/2 w-full h-full">
      {children}
    </div>
  );
}

