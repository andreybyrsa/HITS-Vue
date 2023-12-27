import Notification from '@Domain/Notification'

interface NotificatonModalWindowProps {
  isOpened: boolean
}

interface NotificationTabProps {
  notification: Notification
  isFavourite: boolean
}

interface NotificatonModalWindowEmits {
  (event: 'close-modal'): void
}

export {
  NotificatonModalWindowProps,
  NotificationTabProps,
  NotificatonModalWindowEmits,
}
