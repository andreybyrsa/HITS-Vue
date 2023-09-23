import { defineStore } from 'pinia'
import InitialState from './initialState'
import { Notification } from '@Domain/Notification'

const useNotificationsStore = defineStore('notification', {
  state: (): InitialState => ({
    currentNotification: null,
    notifications: [] as Notification[],
  }),
  actions: {
    async createNotification(notification: string): Promise<void> {
      const id = String(Math.random())
      const newNotification: Notification = {
        id,
        notification,
        read: false,
        closed: false,
      }
      this.notifications.push(newNotification)
    },

    markNotificationAsRead(id: string): void {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    closeNotification(id: string): void {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.closed = true
        notification.read = true
      }
    },
  },
})

export default useNotificationsStore
