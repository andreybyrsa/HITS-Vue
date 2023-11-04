import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const notificationsAxios = defineAxios(getMocks().notifications)

const getNotifications = async (token: string): Promise<Notification[] | Error> => {
  return await notificationsAxios
    .get('/notifications/get/all', {
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
    .get('/notifications/get/favorite', {
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
    .post('/notifications/create', notification, {
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
  id: number,
  token: string,
): Promise<Notification | Error> => {
  return await notificationsAxios
    .putNoRequestBody<Notification>(
      `/put/notifications/mark-as-favorite/${id}`,
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
  id: number,
  token: string,
): Promise<Notification | Error> => {
  return await notificationsAxios
    .putNoRequestBody<Notification>(
      `/put/notifications/unmark-as-favorite/${id}`,
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
  id: number,
  token: string,
): Promise<void | Error> => {
  return await notificationsAxios
    .putNoRequestBody<void>(
      `/notificaion/check/${id}`,
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
  id: number,
  token: string,
): Promise<void | Error> => {
  return await notificationsAxios
    .putNoRequestBody<void>(
      `/put/notifications/close/${id}`,
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
