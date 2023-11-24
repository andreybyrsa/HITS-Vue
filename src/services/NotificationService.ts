import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const notificationsAxios = defineAxios(getMocks().notifications)

const getNotifications = async (token: string): Promise<Notification[] | Error> => {
  return await notificationsAxios
    .get(`/notification/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
    .get('/notification/favourite', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки избранных уведомлений'
      return new Error(error)
    })
}

const createNotification = async (
  notification: Notification,
  token: string,
): Promise<Notification | Error> => {
  return await notificationsAxios
    .post('/notification/create', notification, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания уведомления'
      return new Error(error)
    })
}

const markAsFavoriteNotification = async (
  id: string,
  token: string,
): Promise<Notification | Error> => {
  return await notificationsAxios
    .putNoRequestBody<Notification>(
      `/notification/favourite/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
  id: string,
  token: string,
): Promise<Notification | Error> => {
  return await notificationsAxios
    .putNoRequestBody<Notification>(
      `/notification/unfavourite/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
  id: string,
  token: string,
): Promise<void | Error> => {
  return await notificationsAxios
    .putNoRequestBody<void>(
      `/notification/read/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { isReaded: true } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка просмотра уведомления'
      return new Error(error)
    })
}

const closeNotification = async (
  id: string,
  token: string,
): Promise<void | Error> => {
  return await notificationsAxios
    .putNoRequestBody<void>(
      `/notification/show/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id },
        requestData: { isShowed: true },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка закрытия уведомления'
      return new Error(error)
    })
}

const NotificatonsService = {
  getNotifications,
  getFavoriteNotifications,

  createNotification,

  markAsFavoriteNotification,
  unMarkAsFavoriteNotification,
  checkNotification,
  closeNotification,
}

export default NotificatonsService
