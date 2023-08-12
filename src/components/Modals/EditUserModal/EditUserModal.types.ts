import { User, UpdateUserData } from '@Domain/User'

interface EditUserModalProps {
  isOpened: boolean
  user?: User
}

interface EditUserModalEmits {
  (event: 'close-modal', newUser?: UpdateUserData): void
}

export { EditUserModalProps, EditUserModalEmits }
