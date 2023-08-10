interface EmailsModalProps {
  isOpened: boolean
  emails: string[]
}

interface EmailsModalEmits {
  (event: 'close-modal'): void
  (event: 'remove-email', index: number): void
}

export { EmailsModalProps, EmailsModalEmits }
