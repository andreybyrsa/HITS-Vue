import { User } from '@Domain/User'
import { UpdateUserData } from '@Domain/ManageUsers'

interface EditUserModalProps {
  isOpened: boolean
  user?: User
}

interface EditUserModalEmits {
  (event: 'close-modal', newUser?: UpdateUserData): void
}

export { EditUserModalProps, EditUserModalEmits }
