import { FieldEntry } from 'vee-validate'
import { User } from '@Domain'

export interface CompanyModalProps {
  isOpened: boolean
  companyId?: string
}

export interface UsersColumnsProps {
  users: FieldEntry<User>[]
  unselectedUsers: User[]
}

export interface CompanyModalEmits {
  (event: 'close-modal'): void
}

export interface UsersColumnsEmits {
  (event: 'selectUser', user: User): void
  (event: 'unselectUser', user: User, index: number): void
}
