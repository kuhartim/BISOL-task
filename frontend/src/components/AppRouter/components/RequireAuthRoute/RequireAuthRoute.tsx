import { useAtomValue } from "jotai";
import { Navigate } from "react-router-dom";
import { isLoggedInAtom } from "../../../../features/auth/atoms/auth.atoms";

interface IRequireAuthRouteProps {
  children: React.ReactNode;
}

const RequireAuthRoute = ({ children }: IRequireAuthRouteProps) => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  return !isLoggedIn ? <Navigate replace to="/login" /> : children;
};

export default RequireAuthRoute;
