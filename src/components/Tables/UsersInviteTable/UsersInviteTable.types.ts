import { TeamMember } from '@Domain/Team'

interface UsersInviteTableProps {
  selectedUsers: TeamMember[]
}

interface UsersInviteTableEmits {
  (event: 'close-modal'): void
}

export type { UsersInviteTableProps, UsersInviteTableEmits }
