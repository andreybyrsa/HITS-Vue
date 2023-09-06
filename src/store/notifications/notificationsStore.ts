import { defineStore } from 'pinia'

import NotificationStore from './initialState'

const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationStore => ({
    notifications: [],
    unreadedNotifications: [],
    readedNotifications: [],
  }),
  actions: {
    createNotification(message: string, type?: 'success' | 'error') {
      const notificationId = this.notifications.length
        ? Math.max(...this.notifications.map((notification) => notification.id)) + 1
        : 0

      const notification = { id: notificationId, type, message }

      this.unreadedNotifications.push(notification)
      this.notifications.push(notification)
    },

    readNotification(id: number) {
      const notificationIndex = this.unreadedNotifications.findIndex(
        (notification) => notification.id === id,
      )
      const currentNotification = this.unreadedNotifications[notificationIndex]

      if (currentNotification) {
        this.readedNotifications.push(currentNotification)
        this.unreadedNotifications.splice(notificationIndex, 1)
      }
    },
  },
})

export default useNotificationsStore
