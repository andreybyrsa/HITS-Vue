import { FieldEntry } from 'vee-validate'
import { User } from '@Domain'

export interface UsersColumnsProps {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
  unselectedUsersLabel: string
  selectedUsersLabel: string
}

export interface UsersColumnsEmits {
  (event: 'selectUser', user: User): void
  (event: 'unselectUser', user: User, index: number): void
}
