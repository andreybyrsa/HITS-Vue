import { defineStore } from 'pinia'
import InitialState from './initialState'

const useNotificationsStore = defineStore('notification', {
  state: (): InitialState => ({
    notifications: [],
    newNotifications: [],
    systemNotifications: [],
  }),
  actions: {
    createNotification(title: string, message: string) {
      const id = String(Math.random())
      const notification = {
        id,
        title,
        message,
        readed: false,
      }
      this.notifications.unshift(notification)
    },

    readNotification(id: string) {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.readed = true
      }
    },

    closeNotification(id: string) {
      this.newNotifications = this.newNotifications.filter((n) => n.id !== id)
      this.systemNotifications = this.systemNotifications.filter((n) => n.id !== id)
    },

    createSystemNotification(title: string, message: string) {
      const id = String(Math.random())
      const systemNotification = {
        id,
        title,
        message,
        readed: true,
        type: 'SYSTEM' as const,
      }
      this.systemNotifications.push(systemNotification)
    },
  },
})

export default useNotificationsStore
