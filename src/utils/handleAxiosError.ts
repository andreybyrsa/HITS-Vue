import { AxiosError } from 'axios'

interface ServerError {
  error: string
}

export default function handleAxiosError(
  axiosError: AxiosError<ServerError>,
  errorMessage?: string,
) {
  const { code, response } = axiosError

  if (code !== 'ERR_CANCELED') {
    const serverError = response?.data?.error

    if (serverError) {
      return new Error(serverError)
    }
    if (errorMessage) {
      return new Error(errorMessage)
    }

    return new Error('Ошибка в системе, повторите попытку позже')
  }

  return new Error('Ваша сессия истекла')
}
