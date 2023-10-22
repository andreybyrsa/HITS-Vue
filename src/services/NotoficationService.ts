import axios from 'axios'

import { API_URL } from '@Main'

import Notification from '@Domain/Notification'

const getNotifications = async (token: string): Promise<Notification[] | Error> => {
  return await axios
    .get(`${API_URL}/notification/all`, {
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
    .get(`${API_URL}/notification/new`, {
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
  notificationId: number,
  token: string,
): Promise<undefined | Error> => {
  return await axios
    .delete(`${API_URL}/notification/delete/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления уведомления'
      return new Error(error)
    })
}

const checkNotification = async (notificationId: number, token: string) => {
  return await axios
    .put(`${API_URL}/notification/check/${notificationId}`, {
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
