interface RegisterInputType {
  key: 'email' | 'firstName' | 'lastName' | 'password'
  type?: string
  placeholder: string
  prepend?: string
  prependIcon?: string
}

export default RegisterInputType
