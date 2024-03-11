export interface UsersGroupModalProps {
  isOpened: boolean
  usersGroupId?: string
}

export interface UsersGroupModalEmits {
  (event: 'close-modal'): void
}
