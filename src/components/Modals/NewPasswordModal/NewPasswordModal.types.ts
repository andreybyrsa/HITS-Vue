export interface NewPasswordModalProps {
  isOpened: boolean
  email?: string
  authKey?: string
}

export interface NewPasswordModalInput {
  id: number
  name: 'code' | 'password'
  type?: string
  prepend: string
  placeholder: string
}
