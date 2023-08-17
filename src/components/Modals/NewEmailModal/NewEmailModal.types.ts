interface NewEmailModalProps {
  isOpened: boolean
  email?: string
  authKey?: string
}

interface NewEmailModalInput {
  id: number
  name: 'code' | 'email'
  type?: string
  prepend: string
  placeholder: string
}

export { NewEmailModalProps, NewEmailModalInput }
