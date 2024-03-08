export interface RegisterInputType {
  key: 'email' | 'firstName' | 'lastName' | 'password'
  type?: string
  name: 'email' | 'firstName' | 'lastName' | 'password' | 'telephone' | 'studyGroup'
  placeholder: string
  prepend?: string
  prependIcon?: string
  disabled?: boolean
}
