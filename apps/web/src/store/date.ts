import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fromNow } from "@beacon/basics";

interface DateRange {
  from: Date;
  to: Date;
}

export function useDate() {
  const pathname = usePathname();
  const [date, setDate] = useState<DateRange>({
    from: fromNow(7),
    to: fromNow(),
  });

  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") {
      return;
    }

    const { from, to } = date;

    const url = new URL(window.location.href);
    url.searchParams.set("from", +from + "");
    url.searchParams.set("to", +to + "");

    router.replace(url.href);
  }, [date, pathname]);

  return [date, setDate] as const;
}
