import { Logo } from "./logo";

export function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col text-xl font-semibold gap-4 text-gray-800">
      <div className="flex items-center justify-center text-gray-900 fill-gray-900">
        <Logo className="w-16 h-16" />
        <span className="text-3xl font-bold">Spark</span>
      </div>
    </div>
  );
}

