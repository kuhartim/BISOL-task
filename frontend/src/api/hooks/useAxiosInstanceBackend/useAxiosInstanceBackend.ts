import axios from "axios";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { accessTokenAtom } from "../../../features/auth/atoms/auth.atoms";
import useLogout from "../../../features/auth/hooks/useLogout/useLogout";

export const axiosBackend = axios.create({
  headers: { "Content-Type": "application/json" },
});

const useAxiosInstanceBackend = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const { logout } = useLogout();

  useEffect(() => {
    const requestInterceptor = axiosBackend.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosBackend.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosBackend.interceptors.request.eject(requestInterceptor);
      axiosBackend.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, logout]);

  return axiosBackend;
};

export default useAxiosInstanceBackend;
