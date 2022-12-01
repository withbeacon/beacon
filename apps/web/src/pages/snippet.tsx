import { Logo, Button, Loading } from "@bud/ui";
import { ClipboardIcon, ClipboardCheckIcon } from "@bud/ui";
import Link from "next/link";

import { config, animated, useSpring } from "@react-spring/web";
import { cx } from "class-variance-authority";
import { trpc } from "~/utils";
import { useState } from "react";

export default function Onboard() {
  const [copied, setCopied] = useState(false);
  const query = trpc.user.getId.useQuery();

  const containerSprings = useSpring({
    from: {
      opacity: 0,
      transform: "translateY(-10px)",
    },

    to: {
      opacity: 1,
      transform: "translateY(0px)",
    },

    config: config.slow,
    delay: 100,
  });

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
    <div className="grid h-screen w-screen place-items-center">
      <animated.div
        className="flex max-w-lg flex-col items-start gap-6 px-6 md:p-0"
        style={{ ...containerSprings }}
      >
        <div className="flex items-center text-gray-800">
          <Logo className="mr-2 h-12 w-12" />
          <h2 className="text-2xl font-bold md:text-3xl">Bud</h2>
        </div>

        <h1 className="text-xl font-semibold text-gray-600 md:text-2xl">
          Just copy and paste this snippet to any of your website{" "}
          <span className="text-gray-800">and that&apos;s it!</span>
        </h1>

        <pre className="relative w-full rounded-2xl bg-gray-900 p-4 font-mono text-sm text-gray-100 selection:bg-primary-900 md:text-base">
          <Button className="absolute right-4 top-4" onClick={handleCopy}>
            {copied ? (
              <ClipboardCheckIcon
                className={cx(
                  "h-5 w-5 md:w-6",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            ) : (
              <ClipboardIcon
                className={cx(
                  "h-5 md:w-6",
                  copied ? "text-green-300" : "text-gray-100"
                )}
              />
            )}
          </Button>
          {snippet}
        </pre>

        <Link className="w-full" href="/">
          <Button intent="primary" size="lg" filled fullWidth>
            Done!
          </Button>
        </Link>
      </animated.div>
    </div>
  );
}
