import type { PropsWithChildren } from "react";
import { CrossIcon, HelpIcon, SearchIcon, SelectIcon } from "@bud/ui";
import { WebsiteSelect } from "~/components";
import { Feedback } from "~/components/widgets";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSpring, animated } from "@react-spring/web";
import { trpc } from "~/utils";
import { cx } from "class-variance-authority";
import { useRouter } from "next/router";

export function MobileMenu({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data } = useSession();
  const { id } = router.query;
  const [open, setOpen] = useState(false);
  const query = trpc.website.get.useQuery(id as string);

  const parentSprings = useSpring({
    from: {
      opacity: open ? 0 : 1,
      zIndex: open ? -99 : 49,
    },
    to: {
      opacity: open ? 1 : 0,
      zIndex: open ? 49 : -99,
    },
  });

  return (
    <>
      <button
        className="grid place-items-center outline-none md:hidden"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      <animated.div
        className={cx(
          "absolute top-0 left-0 block h-screen w-screen overflow-hidden md:hidden",
          open ? "bg-gray-900/30" : ""
        )}
        style={{ ...parentSprings }}
      >
        <div
          className={cx(
            "absolute bottom-0 left-0 flex w-screen flex-col gap-6 rounded-t-2xl bg-gray-50 dark:bg-gray-800 p-6 transition duration-500",
            open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          )}
        >
          <div className="relative">
            <button
              className="grid place-items-center pt-2 outline-none"
              onClick={() => setOpen(false)}
            >
              <CrossIcon className="absolute right-0 h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex cursor-pointer gap-2 text-lg text-gray-900 dark:text-gray-100">
            <SearchIcon />
            <p>Search Analytics</p>
          </div>
          <Feedback>
            <div className="flex cursor-pointer gap-2 text-lg text-gray-900 dark:text-gray-100">
              <HelpIcon />
              <p>Share Feedback</p>
            </div>
          </Feedback>
          {query.data && (
            <WebsiteSelect>
              <div className="flex cursor-pointer gap-2 text-lg text-gray-900 dark:text-gray-100">
                <div className="flex cursor-pointer items-center gap-2">
                  <img src={query.data.favicon || ""} className="h-6 w-6" />
                  <h2>{query.data.name}</h2>
                </div>
              </div>
            </WebsiteSelect>
          )}
          <div className="flex cursor-pointer gap-2 text-lg text-gray-900 dark:text-gray-100">
            {data?.user && (
              <img
                className="h-7 w-7 rounded-full"
                src={data?.user?.image || ""}
                alt={data?.user?.name || "Bud User"}
              />
            )}
            <p>Settings</p>
          </div>
        </div>
      </animated.div>
    </>
  );
}
