export interface RegisterInputType {
  key: 'email' | 'firstName' | 'lastName' | 'password' | 'telephone' | 'studyGroup'
  type?: string
  name: 'email' | 'firstName' | 'lastName' | 'password' | 'telephone' | 'studyGroup'
  placeholder: string
  prepend?: string
  prependIcon?: string
  disabled?: boolean
}
