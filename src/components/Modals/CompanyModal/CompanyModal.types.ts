import { FieldEntry } from 'vee-validate'

import { User } from '@Domain/User'

interface CompanyModalProps {
  isOpened: boolean
  companyId?: string
}

interface UsersColumnsProps {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
}

interface CompanyModalEmits {
  (event: 'close-modal'): void
}

interface UsersColumnsEmits {
  (event: 'selectUser', user: User): void
  (event: 'unselectUser', user: User, index: number): void
}

export { CompanyModalProps, UsersColumnsProps, CompanyModalEmits, UsersColumnsEmits }
