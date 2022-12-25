"use client";

import WebsiteSelect from "../websiteSelect";
import { SelectIcon } from "@bud/ui";

import useSWR from "swr";
import { usePathname } from "next/navigation";
import { getWebsite } from "~/utils/query";

export default function Website() {
  const id = usePathname();
  const { data, isLoading } = useSWR(`/api/website/${id}`, () =>
    getWebsite(id as string)
  );

  if (isLoading) {
    return <div className="h-full w-48 animate-pulse bg-gray-500" />;
  }

  if (!id || !data) {
    return null;
  }

  return (
    <>
      <div className="ml-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <div className="hidden cursor-pointer items-center gap-2 md:flex">
          <span className="mr-2 text-gray-500 dark:text-gray-700">{"/"}</span>
          <img src={data.favicon || ""} alt={data.name} className="h-5 w-5" />
          <h2>{data.name}</h2>
          <WebsiteSelect>
            <SelectIcon className="-ml-1 h-5 w-5" />
          </WebsiteSelect>
        </div>
      </div>
    </>
  );
}
