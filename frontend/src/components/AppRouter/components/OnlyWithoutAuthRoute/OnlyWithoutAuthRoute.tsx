import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { isLoggedInAtom } from "../../../../features/auth/atoms/auth.atoms";

const OnlyWithoutAuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  console.log(isLoggedIn);

  return isLoggedIn ? <Navigate replace to="/" /> : children;
};

export default OnlyWithoutAuthRoute;
