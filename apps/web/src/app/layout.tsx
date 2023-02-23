import type { PropsWithChildren } from "react";
import { ServerThemeProvider } from "@wits/next-themes";
import { Inter } from "@next/font/google";
import CommandPalette from "~/components/commandPalette";

import { prisma } from "@beacon/db";
import { getServerSession } from "@beacon/auth";

import "~/styles/globals.css";

const font = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getServerSession();
  const websites = session?.user?.email
    ? await prisma.website.findMany({
        where: {
          user: {
            email: session?.user?.email,
          },
        },
        select: {
          id: true,
          url: true,
          name: true,
        },
      })
    : undefined;

  return (
    <ServerThemeProvider attribute="class">
      <html lang="en" className={font.className}>
        <head />
        <body>
          <CommandPalette websites={websites} />
          {children}
        </body>
      </html>
    </ServerThemeProvider>
  );
}
