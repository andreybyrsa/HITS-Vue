import { Notification } from '@Domain'

export interface NotificationModalProps {
  notification: Notification
  timeExpired?: number
}

export interface NotificationModalEmits {
  (event: 'close-notification', notification: Notification): void
}
