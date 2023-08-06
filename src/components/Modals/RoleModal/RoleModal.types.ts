interface RoleModalProps {
  isOpened: boolean
}

interface RoleModalEmits {
  (event: 'close-modal'): void
}

export { RoleModalProps, RoleModalEmits }
