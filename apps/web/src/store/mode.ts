import { atom, useAtom } from "jotai";

export type Mode = "pageViews" | "sessions";
export const modeAtom = atom<Mode>("pageViews");
export const useMode = () => useAtom(modeAtom);
