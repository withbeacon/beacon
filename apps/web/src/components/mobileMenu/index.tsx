"use client";

import type { PropsWithChildren } from "react";
import type { Website } from "@prisma/client";
import { CrossIcon, HelpIcon, SearchIcon } from "@bud/ui";
import WebsiteSelect from "~/components/websiteSelect";
import Feedback from "~/components/widgets/feedback";
import Settings from "./settings";

import useSWR from "swr";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSpring, animated } from "@react-spring/web";
import { getWebsite } from "~/utils/query";
import { cx } from "class-variance-authority";

interface Props {
  shared?: boolean;
}

export default function MobileMenu({
  children,
  shared = false,
}: PropsWithChildren<Props>) {
  const id = usePathname();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useSWR<Website>(`/api/website/${id}`, () =>
    getWebsite(id as string)
  );

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
            "absolute bottom-0 left-0 flex w-screen flex-col gap-6 rounded-t-2xl bg-gray-50 p-6 transition duration-500 dark:bg-gray-800",
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
          {!shared && (
            <>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
                </div>
              ) : (
                <WebsiteSelect>
                  <div className="flex cursor-pointer gap-2 text-lg text-gray-900 dark:text-gray-100">
                    <div className="flex cursor-pointer items-center gap-2">
                      <img src={data?.favicon || ""} className="h-6 w-6" />
                      <h2>{data?.name}</h2>
                    </div>
                  </div>
                </WebsiteSelect>
              )}
            </>
          )}
          <Settings />
        </div>
      </animated.div>
    </>
  );
}