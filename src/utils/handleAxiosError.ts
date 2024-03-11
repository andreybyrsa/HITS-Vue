import { AxiosError } from 'axios'

interface ServerError {
  error: string
}

export function handleAxiosError(
  axiosError: AxiosError<ServerError>,
  errorMessage?: string,
) {
  const { code, response } = axiosError

  if (code !== 'ERR_CANCELED') {
    const serverError = response?.data?.error

    if (serverError) {
      console.error(serverError)

      return new Error(serverError)
    }
    if (errorMessage) {
      return new Error(errorMessage)
    }

    return new Error('Ошибка в системе, повторите попытку позже')
  }
  console.error(errorMessage)
  return new Error('Ваша сессия истекла')
}
