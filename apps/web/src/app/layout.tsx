import type { PropsWithChildren } from "react";
import { ServerThemeProvider } from "@wits/next-themes";

import "~/styles/globals.css";
import "~/styles/fonts.css";

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <ServerThemeProvider>
      <html>
        <head />
        <body>
          {children}
        </body>
      </html>
    </ServerThemeProvider>
  );
}
