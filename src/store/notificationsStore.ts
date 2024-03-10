import { defineStore } from 'pinia'
import { Notification } from '@Domain'
import { NotificatonService } from '@Service'

interface InitialState {
  notifications: Notification[]
  systemNotifications: Notification[]
}

export const useNotificationsStore = defineStore('notification', {
  state: (): InitialState => ({
    notifications: [],
    systemNotifications: [],
  }),

  getters: {
    fetchNotifications() {
      return async () => {
        const response = await NotificatonService.getNotifications()

        if (response instanceof Error) {
          return response
        }

        this.notifications = response
        return this.notifications
      }
    },

    fetchFavouriteNotifications() {
      return async () => {
        const response = await NotificatonService.getFavoriteNotifications()

        if (response instanceof Error) {
          return response
        }

        this.notifications = response
        return this.notifications
      }
    },

    getReadedNotifications({ notifications }) {
      return notifications.filter(({ isReaded }) => isReaded)
    },

    getUnreadedNotifications({ notifications }) {
      return notifications.filter(({ isReaded }) => !isReaded)
    },

    getFavouriteNotifications({ notifications }) {
      return notifications.filter(({ isFavourite }) => isFavourite)
    },
  },

  actions: {
    async createNotification(title: string, message: string) {
      const notification = {
        title,
        message,
      } as Notification

      const response = await NotificatonService.createNotification(notification)

      if (response instanceof Error) {
        return
      }

      this.notifications.push(notification)
    },

    async readNotification(id: string) {
      const response = await NotificatonService.readNotification(id)

      if (response instanceof Error) {
        return response
      }

      const currentNotification = this.notifications.find(
        (notification) => notification.id === id,
      )

      if (currentNotification) {
        currentNotification.isReaded = true
      }
    },

    async readAllNotifications() {
      const response = await NotificatonService.readAllNotifications()

      if (response instanceof Error) {
        return
      }

      this.notifications.forEach(
        (notification) =>
          notification.isReaded === false && (notification.isReaded = true),
      )
    },

    async markAsFavoriteNotification(id: string) {
      const response = await NotificatonService.markAsFavoriteNotification(id)

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
        return
      }

      const currentNotification = this.notifications.find(
        (notification) => notification.id === id,
      )

      if (currentNotification) {
        currentNotification.isFavourite = true
      }
    },

    async unMarkAsFavoriteNotification(id: string) {
      const response = await NotificatonService.unMarkAsFavoriteNotification(id)

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
        return
      }

      const currentNotification = this.notifications.find(
        (notification) => notification.id === id,
      )

      if (currentNotification) {
        currentNotification.isFavourite = false
      }
    },

    async closeNotification(id: string) {
      const response = await NotificatonService.closeNotification(id)

      if (response instanceof Error) {
        this.createSystemNotification('Система', response.message)
        return
      }

      const currentNotification = this.notifications.find(
        (notification) => notification.id === id,
      )

      if (currentNotification) {
        currentNotification.isShowed = true
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
  },
})
