interface Notification {
  id: number
  type?: 'success' | 'error'
  message: string
}

interface NotificationModalProps {
  notification: Notification
  timeExpired?: number
}

export { Notification, NotificationModalProps }
