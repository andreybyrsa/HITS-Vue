import Notification from '@Domain/Notification'

interface NotificatonModalWindowProps {
  isOpened: boolean
  newNotifications?: Notification[]
  Notifications?: Notification[]
}

interface NotificatonModalWindowEmits {
  (event: 'close-modal'): void
}

export { NotificatonModalWindowProps, NotificatonModalWindowEmits }
