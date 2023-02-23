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
  const websites = await prisma.website.findMany({
    where: {
      user: {
        email: session?.user?.email || undefined,
      },
    },
    select: {
      id: true,
      url: true,
      name: true,
    },
  });

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
