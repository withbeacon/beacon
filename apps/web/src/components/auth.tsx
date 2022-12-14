import { Loading } from "@bud/ui";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export const Auth = ({ children }: Props) => {
  const router = useRouter();
  const session = useSession();

  const ignore = ["/sign-in", "/share"];

  function isIgnored() {
    return ignore.some((path) => {
      if (typeof path === "string") {
        return router.pathname.startsWith(path);
      }
    });
  }

  useEffect(() => {
    if (session.status === "loading" || isIgnored()) {
      return;
    }

    if (session.status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [session.status]);

  if (session.status === "loading") {
    return <Loading />;
  }

  return <>{children}</>;
};
