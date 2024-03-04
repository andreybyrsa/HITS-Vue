import { Notification } from '@Domain'

export interface NotificatonModalWindowProps {
  isOpened: boolean
}

export interface NotificationTabProps {
  notification: Notification
}

export interface NotificatonModalWindowEmits {
  (event: 'close-modal'): void
}
