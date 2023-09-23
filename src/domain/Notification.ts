interface Notification {
  id: string
  notification: string
  read: boolean
  closed: boolean
}

interface newNotification {
  id: string
}

export { Notification, newNotification }
