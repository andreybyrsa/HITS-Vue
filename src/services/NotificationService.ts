import { API_URL } from '@Main'

import Notification from '@Domain/Notification'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const notificationsAxios = defineAxios(getMocks().notifications)

const getNotifications = async (token: string): Promise<Notification[] | Error> => {
  return await notificationsAxios
    .get(`${API_URL}/notifications/get/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки уведомлений'
      return new Error(error)
    })
}

const getFavoriteNotifications = async (
  token: string,
): Promise<Notification[] | Error> => {
  return await notificationsAxios
    .get(`${API_URL}/notifications/get/favorite`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки избранных уведомлений'
      return new Error(error)
    })
}

const markAsFavoriteNotification = async (
  id: number,
  token: string,
): Promise<Notification | Error> => {
  return await notificationsAxios
    .putNoRequestBody<Notification>(
      `${API_URL}/put/notifications/mark-as-favorite/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        params: { id },
        requestData: { isFavourite: true, isReaded: true },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error =
        response?.data?.error ?? 'Ошибка добавления уведомления в избранное'
      return new Error(error)
    })
}

const unMarkAsFavoriteNotification = async (
  id: number,
  token: string,
): Promise<Notification | Error> => {
  return await notificationsAxios
    .putNoRequestBody<Notification>(
      `${API_URL}/put/notifications/unmark-as-favorite/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        params: { id },
        requestData: { isFavourite: false, isReaded: true },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error =
        response?.data?.error ?? 'Ошибка удаления уведомления из избранного'
      return new Error(error)
    })
}

const checkNotification = async (
  id: number,
  token: string,
): Promise<void | Error> => {
  return await notificationsAxios
    .putNoRequestBody<void>(
      `${API_URL}/notificaion/check/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { isReaded: true } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка просмотра уведомления'
      return new Error(error)
    })
}

const NotificatonsService = {
  getNotifications,
  getFavoriteNotifications,

  markAsFavoriteNotification,
  unMarkAsFavoriteNotification,

  checkNotification,
}

export default NotificatonsService
