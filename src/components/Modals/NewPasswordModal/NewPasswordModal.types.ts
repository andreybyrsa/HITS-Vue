interface NewPasswordModalProps {
  isOpened: boolean
  email?: string
  authKey?: string
}

interface NewPasswordModalInput {
  id: number
  name: 'code' | 'password'
  type?: string
  prepend: string
  placeholder: string
}

export { NewPasswordModalProps, NewPasswordModalInput }
