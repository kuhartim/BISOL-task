import { useSetAtom } from "jotai";
import { accessTokenAtom } from "../../atoms/auth.atoms.ts";

const useLogout = () => {
  const setAccessToken = useSetAtom(accessTokenAtom);

  const handleLogout = async () => {
    setAccessToken(null);
  };

  return {
    logout: handleLogout,
  };
};

export default useLogout;
