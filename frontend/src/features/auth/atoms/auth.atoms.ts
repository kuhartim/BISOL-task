import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { atomWithLocalStorage } from "../../../atoms/atomWithLocalStorage/atomWithLocalStorage.ts";

export const accessTokenAtom = atom<string | null>(null);
accessTokenAtom.debugLabel = "accessToken";

export const refreshTokenAtom = atomWithLocalStorage<string | null>(
  "refreshToken",
  null
);
refreshTokenAtom.debugLabel = "refreshToken";

export const isLoggedInAtom = selectAtom(refreshTokenAtom, (token) => !!token);
isLoggedInAtom.debugLabel = "isLoggedIn";
