import UserGroup from '@Domain/Group'

interface AddUsersGroupModalProps {
  isOpened: boolean
  openedGroup?: UserGroup
  groupModalTitle: string
}

interface AddUsersGroupModalEmits {
  (event: 'close-modal'): void
}

export { AddUsersGroupModalProps, AddUsersGroupModalEmits }
