import RolesTypes from './Roles'

interface InvitationForm {
  email: string
  file?: File | null
  roles: RolesTypes[]
}

interface InvitationInfo {
  email: string
  roles: RolesTypes[]
}

export { InvitationForm, InvitationInfo }
