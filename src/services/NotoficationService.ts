import axios from 'axios'

import { Notification } from '@Components/Modals/NotificationModal/NotificationModal.types'

const NOTIFICATION_URL =
  'http://localhost:3000/api/v1/notification' || 'http://localhost:3000'

const getNotifications = async (token: string): Promise<Notification[] | Error> => {
  return await axios
    .get(`${NOTIFICATION_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки уведомлений'
      return new Error(error)
    })
}

const getNewNotifications = async (
  token: string,
): Promise<Notification[] | Error> => {
  return await axios
    .get(`${NOTIFICATION_URL}/new`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки уведомлений'
      return new Error(error)
    })
}

const deleteNotification = async (
  notificationId: string,
  token: string,
): Promise<undefined | Error> => {
  return await axios
    .delete(`${NOTIFICATION_URL}/delete/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления уведомления'
      return new Error(error)
    })
}

const checkNotification = async (notificationId: string, token: string) => {
  return await axios
    .put(`${NOTIFICATION_URL}/check/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка просмотра уведомления'
      return new Error(error)
    })
}

const NotificationsService = {
  getNotifications,
  getNewNotifications,
  deleteNotification,
  checkNotification,
}

export default NotificationsService
