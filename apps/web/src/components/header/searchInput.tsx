"use client";

import type { ChangeEvent } from "react";
import { SearchIcon } from "@beacon/ui";

import { useRouter } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();

  function handleSearch(evt: ChangeEvent<HTMLInputElement>) {
    if (!evt.target.value) {
      router.replace("/");
      return;
    }

    const url = new URL(window.location.href);

    url.searchParams.set("search", evt.target.value);
    router.replace(url.toString());
  }

  return (
    <label className="relative block w-full lg:w-auto">
      {/* TODO: Refactor and make a seperate input component */}

      <span className="sr-only">Search</span>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </span>
      <input
        className="block w-full rounded-md border border-gray-300 bg-gray-200 py-2 pl-10 pr-2 shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 sm:text-sm"
        placeholder="Search for anything..."
        type="text"
        name="search"
        onChange={handleSearch}
      />
    </label>
  );
}
