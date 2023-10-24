interface InviteModalProps<User> {
  name: string
  isOpened: boolean
  users: User[]
  isAdvancedSearch: boolean
  displayBy: (keyof User)[]
  email: keyof User
}

interface InviteModalEmits<User> {
  (event: 'close-modal'): void
  (event: 'inviteRegisteredUsers', users: string[]): void
  (event: 'inviteUnregisteredUsers', emails: string[]): void
  (event: 'searchByAdvacnedField', users: User[], searchedValue: string): User[]
}

interface InviteUnregisteredUsersEmits {
  (event: 'inviteUnregisteredUsers', emails: string[]): void
}

interface InviteRegisteredUsersProps<User> {
  name: string
  users: User[]
  displayBy: (keyof User)[]
  email: keyof User
  isAdvancedSearch: boolean
}

interface InviteRegisteredUsersEmits<User> {
  (event: 'inviteRegisteredUsers', users: string[]): void
  (event: 'onSelect', value: User, index: number): void
  (event: 'onUnselecte', value: User, index: number): void
  (event: 'searchByAdvacnedField', users: User[], searchedValue: string): User[]
}

export {
  InviteModalProps,
  InviteModalEmits,
  InviteUnregisteredUsersEmits,
  InviteRegisteredUsersProps,
  InviteRegisteredUsersEmits,
}
