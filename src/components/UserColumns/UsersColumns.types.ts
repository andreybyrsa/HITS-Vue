import { FieldEntry } from 'vee-validate'

import { User } from '@Domain/User'

interface UsersColumnsProps {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
  unselectedUsersLabel: string
  selectedUsersLabel: string
}
interface UsersColumnsEmits {
  (event: 'selectUser', user: User): void
  (event: 'unselectUser', user: User, index: number): void
}

export { UsersColumnsProps, UsersColumnsEmits }
