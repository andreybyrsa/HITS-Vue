import { User } from '@Domain/User'

interface UsersListProps {
  searchedUsers: User[]
}

interface UsersListEmits {
  (event: 'open-edit-modal', id: number): void
}

export { UsersListProps, UsersListEmits }
