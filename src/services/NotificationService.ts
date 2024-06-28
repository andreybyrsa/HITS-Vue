import axios from 'axios'

import { MODE } from '@Main'

import Notification from '@Domain/Notification'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { notificationsMocks } from '@Utils/getMocks'

const notificationsAxios = defineAxios(notificationsMocks)

const getNotifications = async (token: string): Promise<Notification[] | Error> => {
  return notificationsAxios
    .get('/api/v1/ideas-service/notification/all', {
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
    .get('/api/v1/ideas-service/notification/favourite', {
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
    .post('/api/v1/ideas-service/notification/create', notification, {
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
      `/api/v1/ideas-service/notification/favourite/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { isFavourite: true } },
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
      `/api/v1/ideas-service/notification/unfavourite/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { isFavourite: false } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка удаления уведомления из избранного'),
    )
}

const readNotification = async (
  id: string,
  token: string,
): Promise<void | Error> => {
  return notificationsAxios
    .putNoRequestBody<void>(
      `/api/v1/ideas-service/notification/read/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { isReaded: true } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка чтения уведомления'))
}

const readAllNotifications = async (token: string): Promise<void | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const notifications = notificationsAxios.getReactiveMocks()
    return notifications.value.forEach(
      (notification) =>
        notification.isReaded === false && (notification.isReaded = true),
    )
  }

  return axios
    .put(
      `${process.env.VUE_APP_BACKEND_URL}/ideas-service/notification/read/all`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка чтения всех уведомлений'))
}

const closeNotification = async (
  id: string,
  token: string,
): Promise<void | Error> => {
  return notificationsAxios
    .putNoRequestBody<void>(
      `/api/v1/ideas-service/notification/show/${id}`,
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
  readNotification,
  readAllNotifications,
  closeNotification,
}

export default NotificatonsService
