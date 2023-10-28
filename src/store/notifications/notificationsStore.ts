import { defineStore } from 'pinia'
import InitialState from './initialState'

const useNotificationsStore = defineStore('notification', {
  state: (): InitialState => ({
    notifications: [],
    newNotifications: [],
    systemNotifications: [],
  }),
  actions: {
    createNotification(title: string, message: string, createdAt: string) {
      const id = Math.random()
      const notification = {
        id,
        title,
        message,
        isReaded: false,
        isFavourite: false,
        createdAt,
      }
      this.notifications.unshift(notification)
    },

    readNotification(id: number) {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.isReaded = true
      }
    },

    closeNotification(id: number) {
      this.newNotifications = this.newNotifications.filter((n) => n.id !== id)
      this.systemNotifications = this.systemNotifications.filter((n) => n.id !== id)
    },

    createSystemNotification(title: string, message: string) {
      const id = Math.random()
      const systemNotification = {
        id,
        title,
        message,
        isReaded: true,
        isFavourite: false,
      }
      this.systemNotifications.push(systemNotification)
    },
  },
})

export default useNotificationsStore
