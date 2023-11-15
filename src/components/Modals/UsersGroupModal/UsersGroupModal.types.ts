interface UsersGroupModalProps {
  isOpened: boolean
  usersGroupId?: string
}

interface UsersGroupModalEmits {
  (event: 'close-modal'): void
}

export { UsersGroupModalProps, UsersGroupModalEmits }
