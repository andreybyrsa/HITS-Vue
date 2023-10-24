interface UsersGroupModalProps {
  isOpened: boolean
  usersGroupId?: number
}

interface UsersGroupModalEmits {
  (event: 'close-modal'): void
}

export { UsersGroupModalProps, UsersGroupModalEmits }
