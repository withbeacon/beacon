import type { PropsWithChildren } from "react";
import { ServerThemeProvider } from "@wits/next-themes";
import { Inter } from "@next/font/google";

import "~/styles/globals.css";

const font = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <ServerThemeProvider attribute="class">
      <html lang="en" className={font.className}>
        <head />
        <body>{children}</body>
      </html>
    </ServerThemeProvider>
  );
}
