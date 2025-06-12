import { atom } from "jotai";

export const selectedStopIdAtom = atom<string | null>(null);
export const mapZoomLevelAtom = atom<number>(6);
export const mapCenterAtom = atom<[number, number] | null>(null);
