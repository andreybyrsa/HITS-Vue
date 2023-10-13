import { User } from '@Domain/User'

interface InviteModalProps {
  name: string
  isOpened: boolean
  advancedInfo?: keyof User
}

interface InviteModalEmits {
  (event: 'close-modal'): void
  (event: 'inviteRegisteredUsers', user: User[]): void
  (event: 'inviteUnregisteredUsers', emails: string[]): void
}

interface InviteUnregisteredUsersEmits {
  (event: 'inviteUnregisteredUsers', emails: string[]): void
}

interface InviteRegisteredUsersProps {
  name: string
  advancedInfo?: keyof User
}

interface InviteRegisteredUsersEmits {
  (event: 'inviteRegisteredUsers', users: User[]): void
}

interface InviteUnregisteredUsersForm {
  emails: string[]
}

interface InviteRegisteredUsersForm {
  users: User[]
}

export {
  InviteModalProps,
  InviteModalEmits,
  InviteUnregisteredUsersForm,
  InviteRegisteredUsersForm,
  InviteUnregisteredUsersEmits,
  InviteRegisteredUsersProps,
  InviteRegisteredUsersEmits,
}
