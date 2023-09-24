import UserGroup from '@Domain/UsersGroup'

interface UsersGroupModalProps {
  isOpened: boolean
  openedGroup?: UserGroup
  groupModalTitle: string
}

interface UsersGroupModalEmits {
  (event: 'close-modal'): void
}

export { UsersGroupModalProps, UsersGroupModalEmits }
