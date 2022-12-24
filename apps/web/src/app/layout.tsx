import type { PropsWithChildren } from "react";
import Nav from "~/components/nav";

import "~/styles/globals.css";
import "~/styles/fonts.css";

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <head />
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
