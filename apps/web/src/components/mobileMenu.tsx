import type { PropsWithChildren } from "react";
import { CrossIcon, HelpIcon, SearchIcon, SelectIcon } from "@spark/ui";
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
  const websiteQuery = trpc.website.get.useQuery(id as string);

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
          "absolute top-0 left-0 w-screen h-screen overflow-hidden block md:hidden",
          open ? "bg-gray-900/30" : ""
        )}
        style={{ ...parentSprings }}
      >
        <div
          className={cx(
            "absolute bottom-0 w-screen left-0 p-6 bg-gray-50 rounded-t-2xl flex flex-col gap-6 transition duration-500 drop-shadow-md",
            open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          )}
        >
          <div className="relative">
            <button
              className="grid pt-2 place-items-center outline-none"
              onClick={() => setOpen(false)}
            >
              <CrossIcon className="text-gray-500 absolute right-0 w-6 h-6" />
            </button>
          </div>
          <div className="flex text-gray-900 text-lg gap-2 cursor-pointer">
            <SearchIcon />
            <p>Search Analytics</p>
          </div>
          <Feedback>
            <div className="flex text-gray-900 text-lg gap-2 cursor-pointer">
              <HelpIcon />
              <p>Share Feedback</p>
            </div>
          </Feedback>
          {websiteQuery.data && (
            <WebsiteSelect>
              <div className="flex text-gray-900 text-lg gap-2 cursor-pointer">
                <div className="cursor-pointer items-center gap-2 flex">
                  <img
                    src={websiteQuery.data.favicon || ""}
                    className="w-6 h-6"
                  />
                  <h2>{websiteQuery.data.name}</h2>
                </div>
              </div>
            </WebsiteSelect>
          )}
          <div className="flex text-gray-900 text-lg gap-2 cursor-pointer">
            {data?.user && (
              <img
                className="rounded-full w-7 h-7"
                src={data?.user?.image || ""}
                alt={data?.user?.name || "Spark User"}
              />
            )}
            <p>Settings</p>
          </div>
        </div>
      </animated.div>
    </>
  );
}
