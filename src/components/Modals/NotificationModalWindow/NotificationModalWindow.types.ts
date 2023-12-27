import Notification from '@Domain/Notification'

interface NotificatonModalWindowProps {
  isOpened: boolean
  newNotifications?: Notification[]
  Notifications?: Notification[]
}

interface NotificationTabProps {
  notification: Notification
  isFavourite: boolean
}

interface NotificatonModalWindowEmits {
  (event: 'close-modal'): void
}

interface NotificationTabEmits {
  (event: 'icon-click', notification: Notification): void
}

export {
  NotificatonModalWindowProps,
  NotificationTabProps,
  NotificatonModalWindowEmits,
  NotificationTabEmits,
}
