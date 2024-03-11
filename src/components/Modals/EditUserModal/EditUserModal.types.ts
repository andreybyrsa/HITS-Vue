import { User } from '@Domain'

export interface EditUserModalProps {
  isOpened: boolean
  user: User | null
}

export interface EditUserModalEmits {
  (event: 'close-modal'): void
}

export interface EditUserInputType {
  id: number
  type?: string
  name: 'email' | 'firstName' | 'lastName'
  placeholder: string
  prepend?: string
  prependIconName?: string
}
