import { FieldEntry } from 'vee-validate'

interface UsersColumnsProps<User> {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
  displayBy: (keyof User)[]
  email: keyof User
}

interface UsersColumnsEmits<User> {
  (event: 'onSelect', user: User, index: number): void
  (event: 'onUnselect', user: User, index: number): void
}

export { UsersColumnsProps, UsersColumnsEmits }
