import { User } from '@Domain/User'

interface UsersListProps {
  searchedUsers: User[]
}

interface UsersListEmits {
  (event: 'open-edit-modal', email: string): void
}

export { UsersListProps, UsersListEmits }
