import axios, { AxiosInstance } from 'axios'
import { API_URL } from '@Config'
import { useUserStore } from '@Store'
import { getAbortedSignal, handleAxiosError } from '@Utils'

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
