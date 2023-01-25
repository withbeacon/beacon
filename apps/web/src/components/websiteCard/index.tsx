import Link from "next/link";
import CardDropdown from "./dropdown";

interface Props {
  url: string;
  name: string;
  views: number;
  createdAt: number;
}

export function WebsiteCardShimmer() {
  return (
    <div className="group flex flex-col items-start justify-start gap-4">
      <div className="relative grid h-40 w-full animate-pulse place-items-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800" />

      <div className="flex w-full animate-pulse flex-col justify-between gap-2">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700" />
        <div className="h-3 w-28 text-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default function WebsiteCard({ url, name, views, createdAt }: Props) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const recentlyCreated = createdAt > Date.now() - ONE_DAY * 2;
  let insights: string;

  switch (views) {
    case 0:
      insights = "Got no views since the past day";
      break;

    case 1:
      insights = "Got 1 view since the past day";
      break;

    default:
      insights = `Got ${views} views since the past day`;
  }

  if (recentlyCreated) {
    insights = "Just recently created";
  }

  return (
    <div className="group flex flex-col items-start justify-start gap-4">
      <Link
        href={`/${url}`}
        className="relative grid h-40 w-full place-items-center overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800"
      >
        <div className="relative h-8 w-8">
          <img src={`/favicon/${url}`} className="h-8 w-8 rounded-lg" />
          <img
            src={`/favicon/${url}`}
            className="absolute inset-0 h-8 w-8 opacity-30 blur-md"
          />
        </div>

        <img
          src={`/favicon/${url}`}
          className="absolute -bottom-10 -right-10 h-28 w-28 opacity-50 blur-2xl"
        />
      </Link>

      <div className="flex w-full justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{insights}</p>
        </div>

        <CardDropdown name={name} id={url} />
      </div>
    </div>
  );
}
