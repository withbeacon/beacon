import { Button, Loading } from "@bud/ui";
import { ClipboardCheckIcon, ClipboardIcon, BarIcon } from "@bud/ui";

import { cx } from "class-variance-authority";
import { useState } from "react";
import { trpc } from "~/utils";

export function NoWebsite() {
  const [copied, setCopied] = useState(false);
  const query = trpc.user.getId.useQuery();

  function handleCopy() {
    navigator.clipboard.writeText(snippet);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (query.isLoading) {
    return <Loading />;
  }

  let snippet = "";

  if (typeof window !== "undefined") {
    snippet = `<script
  defer 
  data-bud
  data-id="${query.data}"
  src="${window.location.origin}/track.js"
></script>`;
  }

  return (
    <div className="grid h-full w-full place-items-center overflow-hidden bg-gray-100 py-6 dark:bg-gray-900 md:py-0">
      <div className="flex max-w-lg flex-col items-center gap-6 px-6 text-center text-gray-800 dark:text-gray-200 md:p-0">
        <BarIcon className="h-16 w-16" />
        <h1 className="text-xl font-semibold md:text-2xl">
          Looks like you have not linked any of your website yet..
        </h1>
        <p className="space-lg text-sm text-gray-700 dark:text-gray-300 md:text-base">
          No worries, you can connect your website with bud by just embedding
          the script below in your website.
        </p>

        <div className="relative rounded-2xl bg-gray-900 p-4 text-left font-mono text-sm text-gray-100 selection:bg-primary-900 md:w-full md:text-base dark:border dark:border-gray-800">
          <Button className="absolute right-4 top-4" onClick={handleCopy}>
            {copied ? (
              <ClipboardCheckIcon
                className={cx(
                  "h-5 w-5 md:h-6 md:w-6 ",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            ) : (
              <ClipboardIcon
                className={cx(
                  "h-5 w-5 md:h-6 md:w-6 ",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            )}
          </Button>

          <code className="text-xs sm:whitespace-pre sm:text-sm">
            {snippet}
          </code>
        </div>
      </div>
    </div>
  );
}
