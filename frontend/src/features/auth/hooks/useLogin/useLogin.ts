import { useSetAtom } from "jotai";
import useLoginMutation, {
  ILoginApiParams,
} from "./hooks/useLoginMutation/useLoginMutation.ts";
import { accessTokenAtom } from "../../atoms/auth.atoms.ts";

const useLogin = () => {
  const setAccessToken = useSetAtom(accessTokenAtom);

  const { mutateAsync: login } = useLoginMutation();

  const handleLogin = async (loginApiParams: ILoginApiParams) => {
    const response = await login({
      ...loginApiParams,
    });

    if (response.access_token) {
      setAccessToken(response.access_token);
    }

    return response;
  };

  const loginWithUsername = (username: string, password: string) => {
    const loginApiParams: ILoginApiParams = {
      username: username.trim(),
      password,
    };

    return handleLogin(loginApiParams);
  };

  return {
    loginWithUsername,
  };
};

export default useLogin;
