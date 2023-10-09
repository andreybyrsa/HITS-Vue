import { UpdateUserData } from '@Domain/ManageUsers'

interface EditUserModalProps {
  isOpened: boolean
  user?: UpdateUserData
}

interface EditUserModalEmits {
  (event: 'close-modal'): void
}

interface EditUserInputType {
  id: number
  type?: string
  name: 'newEmail' | 'newFirstName' | 'newLastName'
  placeholder: string
  prepend?: string
  prependIconName?: string
}

export { EditUserModalProps, EditUserModalEmits, EditUserInputType }
