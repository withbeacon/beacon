import { atom, useAtom } from "jotai";
import { fromNow } from "@bud/basics";

interface DateAtom {
  from: Date;
  to: Date;
}

export const dateAtom = atom<DateAtom>({
  from: fromNow(7),
  to: new Date(),
});

export const useDate = () => useAtom(dateAtom);
