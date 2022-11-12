import { SessionProvider } from "next-auth/react";
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
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);
