import Profile from '@Domain/Profile'

interface TeamInviteModalProps {
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
  (event: 'onSelect', value: Profile, index: number): void
  (event: 'onUnselecte', value: Profile, index: number): void
}

interface TeamInviteRegisteredUsersForm {
  users: Profile[]
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
