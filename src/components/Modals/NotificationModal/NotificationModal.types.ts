interface NotificationModalProps {
  isOpened: boolean
  type?: 'success' | 'error'
  timeExpired?: number
}

interface NotificationModalEmits {
  (event: 'close-modal'): void
}

export { NotificationModalProps, NotificationModalEmits }
