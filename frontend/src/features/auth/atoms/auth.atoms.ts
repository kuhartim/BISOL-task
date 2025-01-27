import { selectAtom } from "jotai/utils";
import { atomWithLocalStorage } from "../../../atoms/atomWithLocalStorage/atomWithLocalStorage.ts";

// Not safe to store access in local storage, but for the sake of the example
export const accessTokenAtom = atomWithLocalStorage<string | null>(
  "accessToken",
  null
);
accessTokenAtom.debugLabel = "accessToken";

export const isLoggedInAtom = selectAtom(accessTokenAtom, (token) => !!token);
isLoggedInAtom.debugLabel = "isLoggedIn";
