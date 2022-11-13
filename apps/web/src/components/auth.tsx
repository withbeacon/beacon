import { Loading } from "@spark/ui";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export const Auth = ({ children }: Props) => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [session.status]);

  if (session.status === "loading") {
    return <Loading />
  }

  return <>{children}</>;
};
