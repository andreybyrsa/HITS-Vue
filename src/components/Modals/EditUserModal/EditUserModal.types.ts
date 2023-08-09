import { User } from '@Domain/User'

interface EditUserModalProps {
  isOpened: boolean
  user?: User
}

interface EditUserModalEmits {
  (event: 'close-modal', newUser?: User): void
}

export { EditUserModalProps, EditUserModalEmits }
