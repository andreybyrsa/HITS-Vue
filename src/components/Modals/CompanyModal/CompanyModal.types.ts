import { FieldEntry } from 'vee-validate'

import { User } from '@Domain/User'

interface CompanyModalProps {
  isOpened: boolean
  companyId?: number
}

interface UsersColumnsProps {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
}

interface CompanyModalEmits {
  (event: 'close-modal'): void
}

interface UsersColumnsEmits {
  (event: 'selectUser', user: User, index: number): void
  (event: 'unselectUser', user: User, index: number): void
}

export { CompanyModalProps, UsersColumnsProps, CompanyModalEmits, UsersColumnsEmits }
