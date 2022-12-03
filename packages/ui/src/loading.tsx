import { Logo } from "./logo";

export function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 text-xl font-semibold text-gray-800">
      <div className="flex items-center justify-center fill-gray-900 text-gray-900">
        <Logo className="h-12 w-12 mr-2" />
        <span className="text-3xl font-bold">Bud</span>
      </div>
    </div>
  );
}
