import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Auth, Seo } from "~/components";

import { trpc } from "~/utils/trpc";
import "~/styles/globals.css";
import "~/styles/fonts.css";

import type { AppProps } from "next/app";
import type { Session } from "next-auth";

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <Auth>
        <ThemeProvider attribute="class">
          <Seo />
          <Component {...pageProps} />
        </ThemeProvider>
      </Auth>
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);
