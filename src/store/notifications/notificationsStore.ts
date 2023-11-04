import { defineStore } from 'pinia'

import Notification from '@Domain/Notification'

import NotificatonsService from '@Services/NotificationService'

import InitialState from '@Store/notifications/initialState'

const useNotificationsStore = defineStore('notification', {
  state: (): InitialState => ({
    notifications: [],
    systemNotifications: [],
  }),
  actions: {
    async createNotification(title: string, message: string, token: string) {
      const notification = {
        title,
        message,
      } as Notification

      const response = await NotificatonsService.createNotification(
        notification,
        token,
      )

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
      } else {
        this.notifications.push(notification)
      }
    },
    async readNotificationNotification(id: number, token: string) {
      const response = await NotificatonsService.checkNotification(id, token)

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
      } else {
        const currentNotification = this.notifications.find(
          (notification) => notification.id === id,
        )

        if (currentNotification) {
          currentNotification.isReaded = true
        }
      }
    },
    async closeNotification(id: number, token: string) {
      const response = await NotificatonsService.closeNotification(id, token)

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
      } else {
        const currentNotification = this.notifications.find(
          (notification) => notification.id === id,
        )
        if (currentNotification) {
          currentNotification.isShowed = true
        }
      }

      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.isReaded = true
      }
    },

    createSystemNotification(title: string, message: string) {
      const id = Math.random() * 1000000
      const systemNotification = {
        id,
        title,
        message,
        isShowed: false,
        isFavourite: false,
        isReaded: false,
        createdAt: new Date().toDateString(),
      } as Notification
      this.systemNotifications.push(systemNotification)
    },
    closeSystemNotification(id: number) {
      const currentNotification = this.systemNotifications.find(
        (notification) => notification.id === id,
      )

      if (currentNotification) {
        currentNotification.isShowed = true
      }
    },
  },
})

export default useNotificationsStore
