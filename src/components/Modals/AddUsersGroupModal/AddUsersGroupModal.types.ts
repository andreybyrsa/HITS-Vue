import { UserGroup } from '@Domain/Group'

interface AddUsersGroupModalProps {
  isOpened: boolean
  editingGroup: UserGroup | null
  groupModalTitle: 'Добавить группу' | 'Редактировать группу'
}

interface AddUsersGroupModalEmits {
  (event: 'close-modal'): void
  (event: 'save-group', value: UserGroup): void
  (event: 'delete-group', value: string): void
  (event: 'edit-group', value: UserGroup): void
}

export { AddUsersGroupModalProps, AddUsersGroupModalEmits }
