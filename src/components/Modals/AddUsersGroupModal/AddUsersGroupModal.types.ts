import { UserGroupData } from '@Domain/ManageUsers'
import { User } from '@Domain/User'
import { UserGroup } from '@Domain/Group'

interface AddUsersGroupModalProps {
  isOpened: boolean
  user?: UserGroupData
  usersarray: User[]
  group?: UserGroup
}

interface AddUsersGroupModalEmits {
  (event: 'close-modal', success?: string): void
}

export { AddUsersGroupModalProps, AddUsersGroupModalEmits }
