import type { PropsWithChildren } from "react";
import { ServerThemeProvider } from "@wits/next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "~/components/toaster";
import Script from "next/script";
import CommandPalette from "~/components/commandPalette";

import { prisma } from "@beacon/db";
import { getServerSession } from "@beacon/auth";

import "~/styles/globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata = {
  title:
    "Beacon – fast, simple and privacy friendly analytics that you will love using.",
  description:
    "Beacon is a fast, simple and privacy friendly analytics tool that you will love using.",
  openGraph: {
    siteName: "Beacon",
    url: "https://github.com/withbeacon/beacon",
    locale: "en-US",
    type: "website",
    images: [
      {
        url: "https://withbeacon.co/social.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    creatorId: "@withbeacon",
    siteId: "@withbeacon",
    card: "summary_large_image",
    images: [
      {
        url: "https://withbeacon.co/social.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

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
        <Script src="https://www.withbeacon.co/track.js" strategy="afterInteractive" />
        <body>
          <Toaster richColors />
          <CommandPalette websites={websites} />
          {children}
        </body>
      </html>
    </ServerThemeProvider>
  );
}
