import { UserGroupData } from '@Domain/ManageUsers'
import { User } from '@Domain/User'
import UserGroup from '@Domain/Group'

interface AddExpertGroupModalProps {
  isOpened: boolean
  user?: UserGroupData
  usersarray: User[]
  group?: UserGroup
}

interface AddExpertGroupModalEmits {
  (event: 'close-modal', success?: string): void
}

export { AddExpertGroupModalProps, AddExpertGroupModalEmits }
