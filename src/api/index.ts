import axios, { AxiosInstance } from 'axios'
import { API_URL } from '@Main'
import useUserStore from '@Store/user/userStore'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  config.signal = getAbortedSignal(useUserStore().checkIsExpiredToken)
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => handleAxiosError(error),
)
