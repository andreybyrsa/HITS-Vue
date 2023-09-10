import { UserGroupData } from '@Domain/ManageUsers'
import { User } from '@Domain/User'
import { UserGroup, UpdateUserGroup } from '@Domain/Group'

interface AddUsersGroupModalProps {
  isOpened: boolean
  user?: UserGroupData
  usersarray: User[]
  group?: UserGroup
  editingGroup?: UpdateUserGroup
}

interface AddUsersGroupModalEmits {
  (event: 'close-modal', success?: string): void
}

export { AddUsersGroupModalProps, AddUsersGroupModalEmits }
