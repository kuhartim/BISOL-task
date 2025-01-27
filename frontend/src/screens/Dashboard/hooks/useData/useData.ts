// @flow
import { useQuery } from "@tanstack/react-query";
import useAxiosInstanceBackend from "../../../../api/hooks/useAxiosInstanceBackend/useAxiosInstanceBackend";
import { AppBackendApiEndpoints } from "../../../../api/AppBackendApiEndpoints";
import { useAtomValue } from "jotai";
import { usernameAtom } from "../../../../features/auth/atoms/auth.atoms";

export interface IDataApiParams {
  from_timestamp?: string;
  to_timestamp?: string;
}

interface IData {
  timestamp: string;
  cons: string;
  prod: string;
  price: string;
}

export type IDataResponse = IData[];

const useData = (params?: IDataApiParams) => {
  const axios = useAxiosInstanceBackend();

  const username = useAtomValue(usernameAtom);

  const dataApi = async (data?: IDataApiParams) => {
    const url = AppBackendApiEndpoints.Data();

    return axios
      .get<IDataResponse>(url, {
        params: data,
      })
      .then((res) => res.data);
  };

  const query = useQuery({
    queryKey: ["data", params, username],
    queryFn: () => dataApi(params),
  });

  return query;
};

export default useData;
