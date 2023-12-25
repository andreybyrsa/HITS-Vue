import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'

const notificationsAxios = defineAxios(getMocks().notifications)

const getNotifications = async (token: string): Promise<Notification[] | Error> => {
  return notificationsAxios
    .get('/notifications/get/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки уведомлений'))
}

const getFavoriteNotifications = async (
  token: string,
): Promise<Notification[] | Error> => {
  return notificationsAxios
    .get('/notifications/get/favorite', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка загрузки избранных уведомлений'),
    )
}

const createNotification = async (
  notification: Notification,
  token: string,
): Promise<Notification | Error> => {
  return notificationsAxios
    .post('/notifications/create', notification, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания уведомления'))
}

const markAsFavoriteNotification = async (
  id: string,
  token: string,
): Promise<Notification | Error> => {
  return notificationsAxios
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
    .catch((error) =>
      handleAxiosError(error, 'Ошибка добавления уведомления в избранное'),
    )
}

const unMarkAsFavoriteNotification = async (
  id: string,
  token: string,
): Promise<Notification | Error> => {
  return notificationsAxios
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
    .catch((error) =>
      handleAxiosError(error, 'Ошибка удаления уведомления из избранного'),
    )
}

const checkNotification = async (
  id: string,
  token: string,
): Promise<void | Error> => {
  return notificationsAxios
    .putNoRequestBody<void>(
      `/notificaion/check/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { isReaded: true } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка просмотра уведомления'))
}

const closeNotification = async (
  id: string,
  token: string,
): Promise<void | Error> => {
  return notificationsAxios
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
    .catch((error) => handleAxiosError(error, 'Ошибка закрытия уведомления'))
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
