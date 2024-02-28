import { AxiosError } from 'axios'

interface ServerError {
  error: string
}

function handleAxiosError(
  axiosError: AxiosError<ServerError>,
  errorMessage: string,
) {
  const { code, response } = axiosError

  if (code !== 'ERR_CANCELED') {
    const serverError = response?.data?.error

    if (serverError) {
      console.error(serverError)

      return new Error(serverError)
    }

    console.error(errorMessage)
    return new Error(errorMessage)
  }

  return new Error('Ваша сессия истекла')
}

export default handleAxiosError
