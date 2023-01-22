import CopyButton from "./copyButton";
import DoneButton from "./doneButton";

import { headers } from "next/headers";
import { protect } from "~/utils/auth";

export default async function Page() {
  await protect();

  const host = headers().get("host");
  const snippet = `<script defer src="${host}/track.js"></script>`;

  return (
    <>
      <h1 className="text-2xl font-bold">Just one more step</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Copy and paste the following snippet in your site and you will be good
        to go :)
      </p>
      <code className="rounded-xl bg-gray-100 px-4 py-3 text-base dark:bg-gray-800 my-2">
        {snippet}
      </code>
      <div className="flex gap-4">
        <CopyButton snippet={snippet} />
        <DoneButton />
      </div>
    </>
  );
}
