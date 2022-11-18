import { Button, Loading } from "@spark/ui";
import { ClipboardCheckIcon, ClipboardIcon, BarIcon } from "@spark/ui";

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
  data-spark
  data-id="${query.data}"
  src="${window.location.origin}/track.js"
></script>`;
  }

  return (
    <div className="h-full w-full overflow-hidden grid place-items-center py-6 md:py-0">
      <div className="flex flex-col max-w-lg px-6 md:p-0 items-center gap-6 text-center text-gray-800">
        <BarIcon className="w-16 h-16" />
        <h1 className="text-xl font-semibold md:text-2xl">
          Looks like you have not linked any of your website yet..
        </h1>
        <p className="text-gray-700 text-sm md:text-base space-lg">
          No worries, you can connect your website with spark by just embedding
          the script below in your website.
        </p>

        <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono relative text-sm text-left selection:bg-primary-900 md:text-base md:w-full">
          <Button className="absolute right-4 top-4" onClick={handleCopy}>
            {copied ? (
              <ClipboardCheckIcon
                className={cx(
                  "w-5 h-5 md:w-6 md:h-6 ",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            ) : (
              <ClipboardIcon
                className={cx(
                  "w-5 h-5 md:w-6 md:h-6 ",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            )}
          </Button>

          <code className="sm:text-sm text-xs sm:whitespace-pre">
            {snippet}
          </code>
        </div>
      </div>
    </div>
  );
}
