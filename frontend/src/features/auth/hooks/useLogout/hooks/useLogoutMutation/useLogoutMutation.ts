import useAxiosInstanceBackend from '../../../../../../api/hooks/useAxiosInstanceBackend/useAxiosInstanceBackend.ts'
import { useMutation } from '@tanstack/react-query'
import { AppBackendApiEndpoints } from '../../../../../../api/AppBackendApiEndpoints.ts'

const useLogoutMutation = () => {
  const axios = useAxiosInstanceBackend()

  const logoutApi = async () => {
    const url = AppBackendApiEndpoints.Logout()
    return axios.post(url)
  }

  const mutation = useMutation({
    mutationFn: () => logoutApi()
  })

  return mutation
}

export default useLogoutMutation
