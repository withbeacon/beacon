import type { PropsWithChildren } from "react";

import "~/styles/globals.css";
import "~/styles/fonts.css";

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}
