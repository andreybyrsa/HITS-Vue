import { api } from '@Api'
import { MODE } from '@Config'
import { Notification } from '@Domain'
import { TryCatch, defineAxios, notificationsMocks } from '@Utils'

const defineApi = defineAxios(notificationsMocks)

export class NotificatonService {
  @TryCatch
  static async getNotifications(): Promise<Notification[] | Error> {
    const response = await defineApi.get('/notification/all')
    return response.data
  }

  @TryCatch
  static async getFavoriteNotifications(): Promise<Notification[] | Error> {
    const response = await defineApi.get('/notification/favourite')
    return response.data
  }

  @TryCatch
  static async createNotification(
    notification: Notification,
  ): Promise<Notification | Error> {
    const response = await defineApi.post('/notification/create', notification)
    return response.data
  }

  @TryCatch
  static async markAsFavoriteNotification(
    id: string,
  ): Promise<Notification | Error> {
    const response = await defineApi.putNoRequestBody<Notification>(
      `/notification/favourite/${id}`,
      {},
      { params: { id }, requestData: { isFavourite: true } },
    )
    return response.data
  }

  @TryCatch
  static async unMarkAsFavoriteNotification(
    id: string,
  ): Promise<Notification | Error> {
    const response = await defineApi.putNoRequestBody<Notification>(
      `/notification/unfavourite/${id}`,
      {},
      { params: { id }, requestData: { isFavourite: false } },
    )
    return response.data
  }

  @TryCatch
  static async readNotification(id: string): Promise<void | Error> {
    const response = await defineApi.putNoRequestBody<void>(
      `/notification/read/${id}`,
      {},
      { params: { id }, requestData: { isReaded: true } },
    )
    return response.data
  }

  @TryCatch
  static async readAllNotifications(): Promise<void | Error> {
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

  @TryCatch
  static async closeNotification(id: string): Promise<void | Error> {
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
}
