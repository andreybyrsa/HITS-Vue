import RolesTypes from './Roles'

interface InvitationForm {
  email: string
  emails: string[]
  roles: RolesTypes[]
}

interface InvitationInfo {
  email: string
  roles: RolesTypes[]
}

export { InvitationForm, InvitationInfo }
