import { useAtomValue } from "jotai";
import { isLoggedInAtom } from "../../../../../../features/auth/atoms/auth.atoms";
import useLogout from "../../../../../../features/auth/hooks/useLogout/useLogout";

const LogoutButton = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const { logout } = useLogout();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="btn btn-danger d-flex gap-2 align-items-center"
    >
      <i className="bi bi-box-arrow-right"></i> Odjava
    </button>
  );
};

export default LogoutButton;
