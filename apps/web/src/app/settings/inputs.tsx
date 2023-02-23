"use client";

//import type { ChangeEvent } from "react";
import { SearchIcon } from "@beacon/ui";

import { useRouter } from "next/navigation";

type EmailInputProps = {
  defaultEmail: string;
};

type NameInputProps = {
  defaultName: string;
};

export function EmailInput({ defaultEmail }: EmailInputProps) {
  return (
    <label className="relative flex w-full flex-col gap-2 lg:w-auto">
      {/* TODO: Refactor and make a seperate input component */}

      <span className="text-base font-medium text-gray-700 dark:text-gray-200">
        Email
      </span>
      <input
        className="block w-full items-start rounded-md border border-gray-300 bg-gray-200 py-2 px-4 text-left shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 sm:text-sm"
        value={defaultEmail}
        type="email"
        name="email"
        disabled={true}
      />
    </label>
  );
}

export function NameInput({ defaultName }: NameInputProps) {
  return (
    <label className="relative flex w-full flex-col gap-2 lg:w-auto">
      {/* TODO: Refactor and make a seperate input component */}

      <span className="text-base font-medium text-gray-700 dark:text-gray-200">
        Name
      </span>
      <input
        className="block w-full items-start rounded-md border border-gray-300 bg-gray-200 py-2 px-4 text-left shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 sm:text-sm"
        value={defaultName}
        type="email"
        name="email"
        disabled={true}
      />
    </label>
  );
}
