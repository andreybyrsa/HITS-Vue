interface AddExpertGroupModalProps {
  isOpened: boolean
  currentAddExpertGroup: string[]
}

interface AddExpertGroupModalEmits {
  (event: 'close-modal', addExpertGroup?: string[]): void
}

interface User {
  id: number
  name: string
}

export { AddExpertGroupModalProps, AddExpertGroupModalEmits, User }
