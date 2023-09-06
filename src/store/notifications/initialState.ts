import { Notification } from '@Components/Modals/NotificationModal/NotificationModal.types'

interface NotificationStore {
  notifications: Notification[]
  unreadedNotifications: Notification[]
  readedNotifications: Notification[]
}

export default NotificationStore
