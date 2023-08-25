import { UpdateUserData } from '@Domain/ManageUsers'

interface EditUserModalProps {
  isOpened: boolean
  user?: UpdateUserData
}

interface EditUserModalEmits {
  (event: 'close-modal'): void
  (event: 'save-user', newUser: UpdateUserData, success: string): void
}

export { EditUserModalProps, EditUserModalEmits }
