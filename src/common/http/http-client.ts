import axios, { type AxiosResponse } from 'axios'
import { HttpError } from './http'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const response: AxiosResponse = error.response

      return Promise.reject(new HttpError(response.status, response.statusText, response.data))
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
