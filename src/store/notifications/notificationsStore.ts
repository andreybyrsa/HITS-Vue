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
      this.newNotifications.push(notification)
      this.systemNotifications.push(notification)
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
  },
})

export default useNotificationsStore
