interface ChangeEmailProps {
  isOpened: boolean
}

interface ChangeEmailEmits {
  (event: 'close-modal'): void
}

export { ChangeEmailProps, ChangeEmailEmits }
