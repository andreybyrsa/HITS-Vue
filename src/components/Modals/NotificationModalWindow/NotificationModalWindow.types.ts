import Notification from '@Domain/Notification'

interface NotificatonModalWindowProps {
  isOpened: boolean
}

interface NotificationTabProps {
  notification: Notification
}

interface NotificatonModalWindowEmits {
  (event: 'close-modal'): void
}

export {
  NotificatonModalWindowProps,
  NotificationTabProps,
  NotificatonModalWindowEmits,
}
