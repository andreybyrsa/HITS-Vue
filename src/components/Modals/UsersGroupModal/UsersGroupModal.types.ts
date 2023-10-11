import { FieldEntry } from 'vee-validate'

import { User } from '@Domain/User'

interface UsersGroupModalProps {
  isOpened: boolean
  usersGroupId?: string
}

interface UsersColumnsProps {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
}

interface UsersGroupModalEmits {
  (event: 'close-modal'): void
}

interface UsersColumnsEmits {
  (event: 'selectUser', user: User, index: number): void
  (event: 'unselectUser', user: User, index: number): void
}

export {
  UsersGroupModalProps,
  UsersColumnsProps,
  UsersGroupModalEmits,
  UsersColumnsEmits,
}
