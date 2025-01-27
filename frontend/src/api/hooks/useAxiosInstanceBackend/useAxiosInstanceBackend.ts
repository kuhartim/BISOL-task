import axios from 'axios'

export const axiosBackend = axios.create({
  headers: { 'Content-Type': 'application/json' }
})

const useAxiosInstanceBackend = () => {
  return axiosBackend
}

export default useAxiosInstanceBackend
