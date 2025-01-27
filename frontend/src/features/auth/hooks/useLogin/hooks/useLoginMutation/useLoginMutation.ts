// @flow
import { useMutation } from "@tanstack/react-query";
import useAxiosInstanceBackend from "../../../../../../api/hooks/useAxiosInstanceBackend/useAxiosInstanceBackend";
import { AppBackendApiEndpoints } from "../../../../../../api/AppBackendApiEndpoints";

export interface ILoginApiParams {
  username: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  token_type: "Bearer";
}

const useLoginMutation = () => {
  const axios = useAxiosInstanceBackend();

  const loginApi = async (data: ILoginApiParams) => {
    const url = AppBackendApiEndpoints.Login();
    const { username, password } = data;

    return axios
      .post<ILoginResponse>(url, {
        username,
        password,
      })
      .then((res) => res.data);
  };

  const mutation = useMutation({
    mutationFn: (loginApiParams: ILoginApiParams) => loginApi(loginApiParams),
  });

  return mutation;
};

export default useLoginMutation;
