import RolesTypes from './Roles'

interface InvitationForm {
  emails: string[]
  roles: RolesTypes[]
}

interface InvitationInfo {
  email: string
  roles: RolesTypes[]
}

export { InvitationForm, InvitationInfo }
