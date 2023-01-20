import Link from "next/link";
import CardDropdown from "./dropdown";

interface Props {
  url: string;
  name: string;
  favicon: string | null;
  views: number;
}

export function WebsiteCardShimmer() {
  return (
    <div className="group flex flex-col items-start justify-start gap-4">
      <div className="relative grid h-40 w-full place-items-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />

      <div className="flex w-full justify-between animate-pulse flex-col gap-2">
        <div className="bg-gray-300 dark:bg-gray-700 h-4 w-20"/>
        <div className="text-gray-300 dark:bg-gray-700 w-28 h-3" />
      </div>
    </div>
  );
}

export default function WebsiteCard({ url, name, favicon, views }: Props) {
  return (
    <div className="group flex flex-col items-start justify-start gap-4">
      <Link
        href={`/${url}`}
        className="relative grid h-40 w-full place-items-center overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800"
      >
        <div className="relative h-8 w-8">
          <img src={favicon || undefined} className="h-8 w-8" />
          <img
            src={favicon || undefined}
            className="absolute inset-0 h-8 w-8 opacity-30 blur-md"
          />
        </div>

        <img
          src={favicon || undefined}
          className="absolute -bottom-10 -right-10 h-28 w-28 opacity-50 blur-2xl"
        />
      </Link>

      <div className="flex w-full justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Got {views} views since the past day
          </p>
        </div>

        <CardDropdown name={name} id={url} />
      </div>
    </div>
  );
}
