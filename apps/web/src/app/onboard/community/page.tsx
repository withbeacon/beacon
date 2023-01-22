import { DiscordIcon } from "@beacon/ui";
import Link from "next/link";
import ContinueButton from "./continueButton";

import { protect } from "~/utils/auth";

export default async function Page() {
  await protect();

  return (
    <>
      <h1 className="text-2xl font-bold">Help us build Beacon</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Join our community to help us shape the future of Beacon, we would love
        to build the app with you.
      </p>
      <Link href="https://discord.gg/x8Gkt6upmb" target="_blank" className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-100 py-4 px-6 text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 my-2">
        <div className="flex items-center gap-2">
          <DiscordIcon />
          <span className="text-lg font-semibold">Join our community</span>
        </div>
        <p className="text-base text-gray-400 dark:text-gray-500">
          We can improve only by your feedback and support. Join our community
          to help us with that :)
        </p>
      </Link>
      <ContinueButton />
    </>
  );
}
