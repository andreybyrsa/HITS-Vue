import { api } from '@Api'
import { MODE } from '@Main'
import Notification from '@Domain/Notification'
import defineAxios from '@Utils/defineAxios'
import { notificationsMocks } from '@Utils/getMocks'

const defineApi = defineAxios(notificationsMocks)

const getNotifications = async (): Promise<Notification[] | Error> => {
  const response = await defineApi.get('/notification/all')
  return response.data
}

const getFavoriteNotifications = async (): Promise<Notification[] | Error> => {
  const response = await defineApi.get('/notification/favourite')
  return response.data
}

const createNotification = async (
  notification: Notification,
): Promise<Notification | Error> => {
  const response = await defineApi.post('/notification/create', notification)
  return response.data
}

const markAsFavoriteNotification = async (
  id: string,
): Promise<Notification | Error> => {
  const response = await defineApi.putNoRequestBody<Notification>(
    `/notification/favourite/${id}`,
    {},
    { params: { id }, requestData: { isFavourite: true } },
  )
  return response.data
}

const unMarkAsFavoriteNotification = async (
  id: string,
): Promise<Notification | Error> => {
  const response = await defineApi.putNoRequestBody<Notification>(
    `/notification/unfavourite/${id}`,
    {},
    { params: { id }, requestData: { isFavourite: false } },
  )
  return response.data
}

const readNotification = async (id: string): Promise<void | Error> => {
  const response = await defineApi.putNoRequestBody<void>(
    `/notification/read/${id}`,
    {},
    { params: { id }, requestData: { isReaded: true } },
  )
  return response.data
}

const readAllNotifications = async (): Promise<void | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const notifications = defineApi.getReactiveMocks()
    return notifications.value.forEach(
      (notification) =>
        notification.isReaded === false && (notification.isReaded = true),
    )
  }

  const response = await api.put('/notification/read/all', null)
  return response.data
}

const closeNotification = async (id: string): Promise<void | Error> => {
  const response = await defineApi.putNoRequestBody<void>(
    `/notification/show/${id}`,
    {},
    {
      params: { id },
      requestData: { isShowed: true },
    },
  )
  return response.data
}

export const NotificatonsService = {
  getNotifications,
  getFavoriteNotifications,
  createNotification,
  markAsFavoriteNotification,
  unMarkAsFavoriteNotification,
  readNotification,
  readAllNotifications,
  closeNotification,
}
