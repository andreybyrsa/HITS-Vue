interface RegisterInputType {
  key: 'email' | 'firstName' | 'lastName' | 'password'
  type?: string
  name: 'email' | 'firstName' | 'lastName' | 'password'
  placeholder: string
  prepend?: string
  prependIcon?: string
  disabled?: boolean
}

export default RegisterInputType
