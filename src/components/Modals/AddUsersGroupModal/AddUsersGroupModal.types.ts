import { UserGroup } from '@Domain/Group'

interface AddUsersGroupModalProps {
  isOpened: boolean
  user?: UserGroup
  editingGroup?: UserGroup
  groupModalTitle: 'Добавить группу' | 'Редактировать группу'
}

interface AddUsersGroupModalEmits {
  (event: 'close-modal'): void
  (event: 'save-group'): void
}

export { AddUsersGroupModalProps, AddUsersGroupModalEmits }
