import type { PropsWithChildren } from "react";
import { Logo } from "@beacon/ui";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white dark:bg-gray-900">
      <header className="flex items-center justify-center py-6">
        <Logo className="h-8 w-8" />
        <h1 className="ml-2 text-2xl font-bold">Beacon</h1>
      </header>

      <main className="flex flex-col my-auto w-full gap-2 px-6 lg:px-0 lg:w-[32rem]">{children}</main>
    </div>
  );
}
