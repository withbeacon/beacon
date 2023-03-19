import { Logo } from "@beacon/ui";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex w-full items-center justify-between py-9 text-base px-4">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="h-8 w-8" />
        <span className="text-lg font-medium text-gray-900">Beacon</span>
      </Link>

      <div className="flex items-center gap-6 text-gray-700">
        <Link
          href="https://twitter.com/withbeacon"
          rel="noopener noreferrer"
          target="_blank"
          className="text-lg hidden md:block"
        >
          Twitter
        </Link>
        <Link
          href="https://discord.gg/jXpsbRU2Rr"
          rel="noopener noreferrer"
          target="_blank"
          className="text-lg hidden md:block"
        >
          Community
        </Link>
        <Link
          href="/sign-in"
          className="text-lg hidden md:block"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
