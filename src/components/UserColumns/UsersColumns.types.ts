import { User } from '@Domain/User'
import { FieldEntry } from 'vee-validate'

interface UsersColumnsProps {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
  advancedInfo?: keyof User
}

interface UsersColumnsEmits {
  (event: 'selectUser', user: User, index: number): void
  (event: 'unselectUser', user: User, index: number): void
}

export { UsersColumnsProps, UsersColumnsEmits }
