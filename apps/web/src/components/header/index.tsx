import SearchInput from "./searchInput";

export default function Header() {
  return (
    <header className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center lg:gap-0">
      <h1 className="text-xl font-semibold">My Sites</h1>
      <SearchInput />
    </header>
  );
}
