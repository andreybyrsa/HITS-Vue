import { AxiosError } from 'axios'

import useNotificationsStore from '@Store/notifications/notificationsStore'

interface ServerError {
  error: string
}

function handleAxiosError(
  axiosError: AxiosError<ServerError>,
  errorMessage: string,
  showNotification?: boolean,
) {
  const { code, response } = axiosError

  if (code !== 'ERR_CANCELED') {
    const serverError = response?.data?.error

    if (serverError) {
      return outputErrorMessage(axiosError, serverError, showNotification)
    }

    return outputErrorMessage(axiosError, errorMessage, showNotification)
  }

  return console.warn(axiosError)
}

function outputErrorMessage(
  axiosError: AxiosError<ServerError>,
  errorMessage: string,
  showNotification?: boolean,
) {
  if (showNotification) {
    useNotificationsStore().createSystemNotification('Система', errorMessage)
  }

  console.warn(axiosError)
}

export default handleAxiosError
