const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AppBackendApiEndpoints = {
  Login: () => `${BACKEND_BASE_URL}/auth/login`,
  Data: () => `${BACKEND_BASE_URL}/customers/data`,
};
