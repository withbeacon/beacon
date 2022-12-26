import { SearchIcon, HelpIcon, MenuIcon } from "@bud/ui";
import { Logo } from "@bud/ui";
import { Suspense } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";

const Feedback = dynamic(() => import("~/components/widgets/feedback"), {
  suspense: true
});

const MobileMenu = dynamic(() => import("~/components/mobileMenu"), {
  suspense: true
});

const SettingsDropdown = dynamic(() => import("~/components/settingsDropdown"), {
  suspense: true
});

const SignInButton = dynamic(() => import("./signInButton"), {
  suspense: true
});

const DateSelect = dynamic(() => import("~/components/dateSelect"), {
  suspense: true
});

const Website = dynamic(() => import("./website"), {
  suspense: true
});

interface Props {
  loggedIn?: boolean;
  hideDateSelect?: boolean;
  hideWebsiteSelect?: boolean;
}

export default function Nav({ loggedIn = false, hideDateSelect = false, hideWebsiteSelect = false }: Props) {
  const baseIconStyles =
    "w-6 h-6 hover:opacity-90 cursor-pointer text-gray-800 dark:text-gray-200";

  return (
    <nav className="mx-6 flex items-center justify-between border-b border-gray-200 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 text-xl font-medium text-gray-800 dark:text-gray-200">
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span>Bud</span>
        </Link>
        <Suspense fallback={<p>Loading ...</p>}>
          {!hideWebsiteSelect && <Website />}
        </Suspense>
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <Suspense fallback={<p>Loading ...</p>}>
          {!hideDateSelect && <DateSelect />}
        </Suspense>
        {loggedIn ? (
          <>
            <SearchIcon aria-label="Search" className={baseIconStyles} />
            <Suspense fallback={<p>Loading ...</p>}>
              <Feedback>
                <HelpIcon className={baseIconStyles} />
              </Feedback>
            </Suspense>
          </>
        ) : null}
        <Suspense fallback={<p>Loading ...</p>}>
          {loggedIn ? <SettingsDropdown /> : <SignInButton />}
        </Suspense>
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        <MobileMenu shared={loggedIn}>
          <MenuIcon className={baseIconStyles + " inline-flex md:hidden"} />
        </MobileMenu>
      </Suspense>
    </nav>
  );
}
