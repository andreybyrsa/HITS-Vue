import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

interface TeamInviteModalProps {
  team: Team
  name: string
  isOpened: boolean
}

interface TeamInviteModalEmits {
  (event: 'close-modal'): void
  (event: 'inviteRegisteredUsers', users: string[]): void
  (event: 'inviteUnregisteredUsers', emails: string[]): void
}

interface TeamInviteUnregisteredUsersEmits {
  (event: 'inviteUnregisteredUsers', emails: string[]): void
}

interface TeamInviteRegisteredUsersProps {
  name: string
}

interface TeamInviteRegisteredUsersEmits {
  (event: 'inviteRegisteredUsers', users: string[]): void
  (event: 'onSelect', value: TeamMember, index: number): void
  (event: 'onUnselecte', value: TeamMember, index: number): void
}

interface TeamInviteRegisteredUsersForm {
  users: TeamMember[]
}

interface TeamInviteUnregisteredUsersForm {
  emails: string[]
}

export {
  TeamInviteModalProps,
  TeamInviteModalEmits,
  TeamInviteUnregisteredUsersEmits,
  TeamInviteRegisteredUsersProps,
  TeamInviteRegisteredUsersEmits,
  TeamInviteUnregisteredUsersForm,
  TeamInviteRegisteredUsersForm,
}
