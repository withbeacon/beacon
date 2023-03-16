import Link from "next/link";
import { TwitterIcon, GithubIcon, Logo } from "@beacon/ui";

export default function Footer() {
  return (
    <footer className="flex items-center gap-6 justify-center w-full mt-12 mx-auto py-6 border-t border-gray-200">
      <Link href="https://twitter.com/withbeacon" className="flex items-center gap-2" rel="noopener noreferrer" target="_blank">
        <span className="sr-only">Twitter</span>
        <TwitterIcon className="h-6 w-6 fill-gray-500" />
      </Link>
      <Link href="/" className="flex items-center gap-2">
        <span className="sr-only">Beacon</span>
        <Logo className="h-6 w-6 grayscale" />
      </Link>
      <Link href="https://github.com/withbeacon" className="flex items-center gap-2" rel="noopener noreferrer" target="_blank">
        <span className="sr-only">Github</span>
        <GithubIcon className="h-6 w-6 fill-gray-500" />
      </Link>
    </footer>
  )
}

