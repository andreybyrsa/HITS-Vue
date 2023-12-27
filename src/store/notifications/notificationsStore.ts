import { defineStore } from 'pinia'

import Notification from '@Domain/Notification'

import NotificatonsService from '@Services/NotificationService'

import InitialState from '@Store/notifications/initialState'

const useNotificationsStore = defineStore('notification', {
  state: (): InitialState => ({
    notifications: [],
    systemNotifications: [],
  }),
  getters: {
    getNotifications() {
      return async (token: string) => {
        const response = await NotificatonsService.getNotifications(token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        } else {
          this.notifications = response
          return this.notifications
        }
      }
    },
  },

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
    async readNotification(id: string, token: string) {
      const response = await NotificatonsService.readNotification(id, token)

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
    async readAllNotifications(token: string) {
      const response = await NotificatonsService.readAllNotifications(token)

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
      } else {
        this.notifications.forEach(
          (notification) =>
            notification.isReaded === false && (notification.isReaded = true),
        )
      }
    },
    async closeNotification(id: string, token: string) {
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
    },

    createSystemNotification(title: string, message: string) {
      const id = (Math.random() * 1000000).toString()
      const systemNotification = {
        id,
        title,
        message,
        isShowed: false,
      } as Notification
      this.systemNotifications.push(systemNotification)
    },

    closeSystemNotification(id: string) {
      const currentNotification = this.systemNotifications.find(
        (notification) => notification.id === id,
      )

      if (currentNotification) {
        currentNotification.isShowed = true
      }
    },

    async markAsFavoriteNotification(id: string, token: string) {
      const response = await NotificatonsService.markAsFavoriteNotification(
        id,
        token,
      )

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
      } else {
        const currentNotification = this.systemNotifications.find(
          (notification) => notification.id === id,
        )

        if (currentNotification) {
          currentNotification.isFavourite = true
        }
      }
    },

    async unMarkAsFavoriteNotification(id: string, token: string) {
      const response = await NotificatonsService.unMarkAsFavoriteNotification(
        id,
        token,
      )

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
      } else {
        const currentNotification = this.systemNotifications.find(
          (notification) => notification.id === id,
        )

        if (currentNotification) {
          currentNotification.isFavourite = false
        }
      }
    },
  },
})

export default useNotificationsStore
