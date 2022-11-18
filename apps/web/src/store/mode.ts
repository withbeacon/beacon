import { atom } from "jotai";

export type Mode = "pageViews" | "sessions";
export const modeAtom = atom<Mode>("pageViews");

