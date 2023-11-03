import { User } from '@Domain/User'

interface EditUserModalProps {
  isOpened: boolean
  user: User | null
}

interface EditUserModalEmits {
  (event: 'close-modal'): void
}

interface EditUserInputType {
  id: number
  type?: string
  name: 'email' | 'firstName' | 'lastName'
  placeholder: string
  prepend?: string
  prependIconName?: string
}

export { EditUserModalProps, EditUserModalEmits, EditUserInputType }
