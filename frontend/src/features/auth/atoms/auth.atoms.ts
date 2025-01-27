import { selectAtom } from "jotai/utils";
import { atomWithLocalStorage } from "../../../atoms/atomWithLocalStorage/atomWithLocalStorage.ts";
import { jwtDecode } from "jwt-decode";

// Not safe to store access in local storage, but for the sake of the example
export const accessTokenAtom = atomWithLocalStorage<string | null>(
  "accessToken",
  null
);
accessTokenAtom.debugLabel = "accessToken";

export const isLoggedInAtom = selectAtom(accessTokenAtom, (token) => !!token);
isLoggedInAtom.debugLabel = "isLoggedIn";

interface JwtPayload {
  sub: string;
}

export const usernameAtom = selectAtom(accessTokenAtom, (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
});
usernameAtom.debugLabel = "username";
