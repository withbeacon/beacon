import SearchInput from "./searchInput";

export default function Header() {
  return (
    <header className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center lg:gap-0">
      <h1 className="text-xl font-semibold">My Sites</h1>
      <SearchInput />
    </header>
  );
}

export function HeaderShimmer() {
  return (
    <header className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center lg:gap-0">
      <div className="w-32 h-7 bg-gray-400 dark:bg-gray-600 animate-pulse" />
      <div className="flex gap-2">
        <div className="w-7 rounded-full h-7 bg-gray-400 dark:bg-gray-600 animate-pulse" />
        <div className="w-32 h-7 bg-gray-400 dark:bg-gray-600 animate-pulse" />
      </div>
    </header>
  );
}
