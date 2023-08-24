import { UserGroupData } from '@Domain/ManageUsers'
import { User } from '@Domain/User'
import Group from '@Domain/Group'

interface AddExpertGroupModalProps {
  isOpened: boolean
  user?: UserGroupData
  usersarray: User[]
  group?: Group
}

interface AddExpertGroupModalEmits {
  (event: 'close-modal', success?: string): void
}

export { AddExpertGroupModalProps, AddExpertGroupModalEmits }
