import { useAtom } from "jotai";
import { persistedAtom } from "./utils";

export const websiteAtom = persistedAtom<string | null>("website-id", null);
export const useWebsite = () => useAtom(websiteAtom);
