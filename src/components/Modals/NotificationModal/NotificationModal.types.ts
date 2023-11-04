import Notification from '@Domain/Notification'

interface NotificationModalProps {
  notification: Notification
  timeExpired?: number
}

interface NotificationModalEmits {
  (event: 'close-notification', notification: Notification): void
}

export { NotificationModalProps, NotificationModalEmits }
